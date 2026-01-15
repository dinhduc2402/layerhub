# Phase 03: Pagehook Sanitization Tracking

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 01: Rule Metadata Architecture](./phase-01-rule-metadata-architecture.md)
- **Related Docs**: [Extension Workflow](../20260115-extension-workflow-documentation.md)

## Overview

**Date**: 2026-01-15
**Description**: Add rule tracking to pagehook.js sanitization layer
**Priority**: High
**Implementation Status**: Not Started
**Review Status**: Not Reviewed

## Key Insights

### Current Sanitization Logic (from research)

**File**: `pagehook.js` (lines 11-62)

**Sanitization Rules**:
1. Primitives (string, number, boolean) pass through
2. BigInt converted to Number
3. Symbols and functions removed (return undefined)
4. Depth limit: max 6 levels
5. Circular reference detection via WeakSet
6. Arrays: only keep elements with 'event' property
7. Objects: must have 'event' property to be included

### Current Flow

```
Page dataLayer.push(data)
  ↓
  Wrapped push() executes
  ↓
  sanitize(data) → removes non-cloneable data
  ↓
  emit('LH_DL_PUSH', {item: sanitizedData})
  ↓
  Content script relays to background
```

### Challenge: Context Limitation

Pagehook runs in MAIN world:
- Cannot import Chrome extension modules
- Cannot use chrome.storage API
- Must be self-contained
- Communication only via DOM events

## Requirements

### Functional Requirements

1. **Inline Sanitization Tracking**
   - Track sanitization decisions in-place
   - No external dependencies
   - Lightweight metadata structure

2. **Sanitization Metadata**
   - Record what was removed (types, properties)
   - Track depth truncations
   - Note circular reference detections
   - Capture event property filtering

3. **Propagate to Background**
   - Include metadata in DOM event detail
   - Serialize metadata safely
   - Merge with background validation metadata

4. **Configurable via Settings**
   - Check if tracking enabled (communicated from background)
   - Respect detail level settings
   - Graceful fallback if disabled

### Non-Functional Requirements

1. **Performance**: <2ms overhead per sanitize() call
2. **Size**: <1KB metadata per event
3. **Compatibility**: Work with existing sanitize() logic

## Architecture

### Sanitization Metadata Structure

```javascript
// Embedded in pagehook.js (no imports)
const SanitizationMetadata = {
  removedTypes: [],        // ['function', 'symbol', 'bigint']
  removedProperties: [],   // ['{path}.functionName', '{path}.symbolKey']
  depthTruncations: [],    // ['{path}.deeply.nested.object']
  circularRefs: [],        // ['{path}.circular.reference']
  eventFiltering: {        // Array/object event property filtering
    arraysFiltered: 0,     // Number of array elements removed
    objectsFiltered: 0     // Number of objects without event property
  },
  typeConversions: [],     // ['BigInt → Number at {path}']
  stats: {
    originalSize: 0,       // Rough size estimate
    sanitizedSize: 0,      // After sanitization
    levelsDeep: 0          // Max depth reached
  }
};
```

### Enhanced sanitize() Function

```javascript
// pagehook.js - Enhanced version

function sanitizeWithTracking(value, depth = 0, seen, path = 'root', metadata = null) {
  // Initialize metadata on first call
  if (metadata === null) {
    metadata = {
      removedTypes: [],
      removedProperties: [],
      depthTruncations: [],
      circularRefs: [],
      eventFiltering: { arraysFiltered: 0, objectsFiltered: 0 },
      typeConversions: [],
      stats: { originalSize: 0, sanitizedSize: 0, levelsDeep: depth }
    };
  }

  // Update max depth
  if (depth > metadata.stats.levelsDeep) {
    metadata.stats.levelsDeep = depth;
  }

  const MAX_DEPTH = 6;
  if (value == null) return { value, metadata };

  const t = typeof value;

  // Primitives
  if (t === 'string' || t === 'number' || t === 'boolean') {
    return { value, metadata };
  }

  // BigInt conversion
  if (t === 'bigint') {
    metadata.typeConversions.push(`BigInt → Number at ${path}`);
    return { value: Number(value), metadata };
  }

  // Remove functions and symbols
  if (t === 'symbol' || t === 'function') {
    metadata.removedTypes.push(t);
    metadata.removedProperties.push(path);
    return { value: undefined, metadata };
  }

  // Depth limit
  if (depth >= MAX_DEPTH) {
    metadata.depthTruncations.push(path);
    return { value: undefined, metadata };
  }

  seen = seen || new WeakSet();

  if (typeof value === 'object') {
    // Circular reference check
    if (seen.has(value)) {
      metadata.circularRefs.push(path);
      return { value: undefined, metadata };
    }
    seen.add(value);

    // Arrays
    if (Array.isArray(value)) {
      const out = [];
      let filteredCount = 0;

      for (let i = 0; i < value.length; i++) {
        try {
          const item = value[i];
          // Check if this item has an "event" property
          if (item && typeof item === 'object' && 'event' in item) {
            const result = sanitizeWithTracking(item, depth + 1, seen, `${path}[${i}]`, metadata);
            metadata = result.metadata;
            out.push(result.value !== undefined ? result.value : item);
          } else {
            filteredCount++;
          }
        } catch (error) {
          console.warn(`Error processing array element at ${path}[${i}]:`, error);
        }
      }

      metadata.eventFiltering.arraysFiltered += filteredCount;
      return { value: out, metadata };
    }

    // Objects
    if ('event' in value) {
      // This is an event object, sanitize all its properties
      const out = {};
      for (const k in value) {
        try {
          const result = sanitizeWithTracking(value[k], depth + 1, seen, `${path}.${k}`, metadata);
          metadata = result.metadata;
          out[k] = result.value !== undefined ? result.value : value[k];
        } catch (error) {
          console.warn(`Error sanitizing property ${path}.${k}:`, error);
          out[k] = `[Error: ${error.message}]`;
        }
      }
      return { value: out, metadata };
    } else {
      // This is not an event object
      metadata.eventFiltering.objectsFiltered++;
      return { value: undefined, metadata };
    }
  }

  return { value: undefined, metadata };
}
```

### Enhanced hook() Function

```javascript
// pagehook.js - Modified hook function

function hook(dl) {
  if (!isArrayLikeWithPush(dl)) return false;
  if (dl.__LH_WRAPPED__) return true;
  dl.__LH_WRAPPED__ = true;

  let lastIndex = 0;

  // Initial emit
  try {
    const raw = Array.prototype.slice.call(dl);
    lastIndex = raw.length;

    // Sanitize with tracking
    const result = sanitizeWithTracking(raw);

    emit('LH_DL_INITIAL', {
      items: result.value,
      sanitization: result.metadata  // NEW: Include metadata
    });
  } catch (e) { }

  // Wrap push
  try {
    const originalPush = dl.push.bind(dl);
    dl.push = function (...args) {
      const r = originalPush(...args);
      try {
        args.forEach(x => {
          const result = sanitizeWithTracking(x);
          emit('LH_DL_PUSH', {
            item: result.value,
            sanitization: result.metadata  // NEW: Include metadata
          });
        });

        if (dl.__LH_POLL__) {
          clearInterval(dl.__LH_POLL__);
          dl.__LH_POLL__ = null;
        }
      } catch (e) { }
      lastIndex = dl.length;
      return r;
    };
  } catch (e) { }

  // Polling fallback (also with tracking)
  const poll = setInterval(() => {
    try {
      const len = dl.length >>> 0;
      if (len > lastIndex) {
        for (let i = lastIndex; i < len; i++) {
          try {
            const result = sanitizeWithTracking(dl[i]);
            emit('LH_DL_PUSH', {
              item: result.value,
              sanitization: result.metadata  // NEW: Include metadata
            });
          } catch (_) { }
        }
        lastIndex = len;
      }
    } catch (_) { }
  }, 250);

  try { dl.__LH_POLL__ = poll; } catch (_) { }
  return true;
}
```

### Configuration Communication

Since pagehook cannot access chrome.storage, use DOM event:

```javascript
// background.js - On settings update
function notifyPagehookOfSettings(tabId) {
  chrome.tabs.sendMessage(tabId, {
    type: 'UPDATE_TRACKING_CONFIG',
    config: {
      sanitizationTracking: currentSettings?.ruleTracking?.categories?.sanitization || false,
      detailedMetadata: currentSettings?.ruleTracking?.detailedMetadata || false
    }
  }).catch(() => {});
}

// content.js - Relay to pagehook
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'UPDATE_TRACKING_CONFIG') {
    document.dispatchEvent(new CustomEvent('LH_CONFIG_UPDATE', {
      detail: msg.config
    }));
  }
});

// pagehook.js - Receive config
let trackingConfig = {
  sanitizationTracking: false,
  detailedMetadata: false
};

document.addEventListener('LH_CONFIG_UPDATE', (e) => {
  trackingConfig = e.detail;
});

// Use in sanitize
function sanitize(value, depth = 0, seen, path = 'root') {
  if (trackingConfig.sanitizationTracking) {
    return sanitizeWithTracking(value, depth, seen, path).value;
  } else {
    // Original sanitize logic (no tracking)
    return sanitizeOriginal(value, depth, seen);
  }
}
```

## Related Code Files

**Modified Files**:
- `pagehook.js` (lines 11-62: sanitize, lines 68-113: hook)
- `content.js` (add config relay listener)
- `background.js` (add notifyPagehookOfSettings)

## Implementation Steps

### Step 1: Create Tracking Variant
File: `pagehook.js`
- Keep original sanitize() as sanitizeOriginal()
- Implement sanitizeWithTracking() with metadata collection
- Return { value, metadata } tuple

### Step 2: Conditional Tracking
File: `pagehook.js`
- Add trackingConfig global variable
- Check config before choosing sanitize variant
- Default to tracking disabled

### Step 3: Config Communication
File: `background.js`, `content.js`, `pagehook.js`
- Implement LH_CONFIG_UPDATE event chain
- Send config on settings change
- Send config on pagehook injection

### Step 4: Metadata Propagation
File: `pagehook.js`
- Include sanitization metadata in LH_DL_INITIAL event
- Include sanitization metadata in LH_DL_PUSH event
- Ensure metadata serializable (no WeakSet references)

### Step 5: Background Integration
File: `background.js`
- Extract sanitization metadata from messages
- Merge with blacklist validation metadata
- Store in TrackedItem.validation.byCategory.sanitization

### Step 6: Size Optimization
File: `pagehook.js`
- Implement compact metadata format
- Omit empty arrays
- Compress repeated paths

Example compact format:
```javascript
{
  rm: ['function:root.onClick', 'symbol:root[sym]'],  // removed (type:path)
  dt: ['root.a.b.c.d.e.f.g'],                         // depth truncated
  cr: ['root.circular'],                              // circular refs
  tc: ['bigint:root.bigNum'],                         // type conversions
  ef: [5, 2],                                         // event filtering [arrays, objects]
  st: [150, 120, 4]                                   // stats [orig, sanitized, depth]
}
```

### Step 7: Performance Testing
- Benchmark sanitizeWithTracking vs sanitizeOriginal
- Test with deeply nested objects (depth 10+)
- Test with large arrays (1000+ elements)
- Verify <2ms overhead requirement

## Todo List

- [ ] Create sanitizeOriginal() copy of current sanitize()
- [ ] Implement sanitizeWithTracking() with metadata
- [ ] Add trackingConfig global to pagehook.js
- [ ] Implement conditional sanitize() dispatcher
- [ ] Add LH_CONFIG_UPDATE event listener in pagehook.js
- [ ] Add config relay in content.js
- [ ] Implement notifyPagehookOfSettings in background.js
- [ ] Modify hook() to include metadata in emit() calls
- [ ] Update LH_DL_REQUEST_INITIAL handler to send config
- [ ] Modify background.js to extract sanitization metadata
- [ ] Merge sanitization metadata with validation metadata
- [ ] Implement compact metadata format
- [ ] Write performance benchmarks
- [ ] Test with complex nested objects
- [ ] Test with circular references

## Success Criteria

1. **Tracking Functional**
   - Sanitization decisions captured in metadata
   - All removal reasons documented
   - Type conversions tracked

2. **Performance Maintained**
   - <2ms overhead per sanitize() call
   - No impact when tracking disabled
   - Memory usage acceptable (<1KB per event)

3. **Metadata Accurate**
   - Removed properties correctly identified
   - Depth truncations logged with paths
   - Circular references detected

4. **Integration Complete**
   - Metadata propagates through DOM events
   - Background merges sanitization + blacklist metadata
   - Settings control tracking on/off

5. **Backward Compatible**
   - Original sanitize() preserved
   - Works without configuration
   - Falls back gracefully

## Risk Assessment

### Technical Risks

**High Risk**:
- Metadata bloat for complex objects
  - *Mitigation*: Compact format, path abbreviation

**Medium Risk**:
- Performance impact on sanitize() hot path
  - *Mitigation*: Conditional execution, optimize tracking code

**Low Risk**:
- Configuration not received before first event
  - *Mitigation*: Default to disabled, lazy enable

### Integration Risks

**Medium Risk**:
- DOM event size limits with large metadata
  - *Mitigation*: Compress metadata, omit if too large

**Low Risk**:
- Config update race conditions
  - *Mitigation*: Apply config on next sanitize call

## Security Considerations

1. **Code Injection**
   - Pagehook runs in MAIN world (shares page context)
   - *Control*: No eval(), sanitize config values

2. **Data Leakage**
   - Metadata paths might expose structure
   - *Control*: User must enable tracking explicitly

3. **Performance DoS**
   - Malicious page with deeply nested objects
   - *Control*: Existing MAX_DEPTH limit, tracking overhead minimal

## Next Steps

1. Implement sanitizeWithTracking() prototype
2. Benchmark performance impact
3. Test metadata size with real-world events
4. Integrate with background validation metadata
5. Proceed to Phase 04: UI rule display

## Unresolved Questions

1. Should paths be abbreviated (e.g., 'r.a.b' instead of 'root.a.b')?
2. Metadata size limit before truncation?
3. Include original unsanitized values in metadata for debugging?
4. Track sanitization time per event?
