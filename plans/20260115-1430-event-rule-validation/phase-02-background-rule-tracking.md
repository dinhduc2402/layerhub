# Phase 02: Background Rule Tracking

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 01: Rule Metadata Architecture](./phase-01-rule-metadata-architecture.md)
- **Related Docs**: [Extension Workflow](../20260115-extension-workflow-documentation.md)

## Overview

**Date**: 2026-01-15
**Description**: Implement rule tracking in background.js for blacklist filtering and item formatting
**Priority**: High
**Implementation Status**: Not Started
**Review Status**: Not Reviewed

## Key Insights

### Current Background Validation (from research)

**File**: `background.js`

1. **shouldIgnoreItem function** (lines 332-368)
   - 11 blacklisted event names
   - Type validation (null, non-object)
   - Event property validation
   - Empty key validation

2. **Item Formatting** (lines 85-95, 114-121)
   - Sequential indexing
   - Timestamp assignment
   - Event name extraction
   - Max 200 items limit enforcement

3. **Message Processing** (lines 79-102, 104-144)
   - LH_DL_INITIAL: Filter and map initial snapshot
   - LH_DL_PUSH: Filter and format new events
   - Broadcast to side panel

### Current Flow

```
Content Script → Background
  ↓
  shouldIgnoreItem(item)
  ↓ (if valid)
  Create TrackedItem {index, time, eventName, payload}
  ↓
  Store in tabDataStore
  ↓
  Broadcast to side panel
```

## Requirements

### Functional Requirements

1. **Blacklist Rule Tracking**
   - Track each blacklist rule check
   - Record why events rejected
   - Capture rule execution order

2. **Filtered Event Storage**
   - Store rejected events separately
   - Include rejection reason
   - Maintain size limits

3. **Metadata Attachment**
   - Attach rule results to TrackedItem
   - Include validation summary
   - Preserve existing payload

4. **Settings Integration**
   - Respect ruleTracking.enabled setting
   - Apply per-category toggles
   - Handle disabled tracking gracefully

### Non-Functional Requirements

1. **Performance**: <5ms overhead per event
2. **Memory**: <50KB per 100 events with metadata
3. **Backward Compatibility**: Existing code paths work unchanged

## Architecture

### Enhanced Background State

```javascript
// Extend tabDataStore structure
const tabDataStore = new Map(); // tabId → TabData

interface TabData {
  items: TrackedItemWithRules[];        // Changed from TrackedItem[]
  accountData: any | null;
  lastUpdate: number;
  ready: boolean;
  eventCounter: number;
  filteredEvents?: FilteredEvent[];     // NEW: Rejected events
  ruleStats?: {                         // NEW: Per-tab statistics
    totalProcessed: number;
    totalRejected: number;
    rejectionReasons: Map<string, number>;
  };
}
```

### Rule Executors for Background

```javascript
// src/rules/executors/blacklist.js

class BlacklistExecutor {
  static RULES = {
    NULL_CHECK: 'bg.blacklist.null_check',
    TYPE_CHECK: 'bg.blacklist.type_check',
    EVENT_PROPERTY: 'bg.blacklist.event_property',
    BLACKLIST_MATCH: 'bg.blacklist.name_match',
    EMPTY_KEYS: 'bg.blacklist.empty_keys'
  };

  execute(item, context = {}) {
    const collector = new RuleCollector();

    // Rule 1: Null check
    collector.record({
      ruleId: BlacklistExecutor.RULES.NULL_CHECK,
      ruleName: 'Null/Undefined Check',
      category: 'blacklist',
      status: (item == null) ? 'fail' : 'pass',
      timestamp: Date.now(),
      details: (item == null) ? {
        reason: 'Event is null or undefined'
      } : undefined
    });

    if (item == null) return collector;

    // Rule 2: Type check
    const t = typeof item;
    collector.record({
      ruleId: BlacklistExecutor.RULES.TYPE_CHECK,
      ruleName: 'Object Type Check',
      category: 'blacklist',
      status: (t !== 'object') ? 'fail' : 'pass',
      timestamp: Date.now(),
      details: (t !== 'object') ? {
        reason: `Event must be object, got ${t}`,
        actual: t,
        expected: 'object'
      } : undefined
    });

    if (t !== 'object') return collector;

    // Rule 3: Event property check
    const hasEvent = typeof item.event === 'string' && item.event.trim() !== '';
    collector.record({
      ruleId: BlacklistExecutor.RULES.EVENT_PROPERTY,
      ruleName: 'Event Property Validation',
      category: 'blacklist',
      status: hasEvent ? 'pass' : 'fail',
      timestamp: Date.now(),
      details: !hasEvent ? {
        reason: 'Missing or empty event property',
        actual: item.event
      } : undefined
    });

    // Rule 4: Blacklist match (if has event)
    if (hasEvent) {
      const eventName = item.event.trim().toLowerCase();
      const INVALID_EVENT_NAMES = [
        'item', 'gtm.js', 'gtm.dom', 'gtm.load', 'gtm.historyChange',
        'gtm.scrollDepth', 'gtm.linkClick', 'gtm.formSubmit',
        'gtm.timer', 'gtm.video', 'optimize.activate'
      ];

      const isBlacklisted = INVALID_EVENT_NAMES.some(
        invalid => eventName === invalid.toLowerCase()
      );

      collector.record({
        ruleId: BlacklistExecutor.RULES.BLACKLIST_MATCH,
        ruleName: 'Event Name Blacklist',
        category: 'blacklist',
        status: isBlacklisted ? 'fail' : 'pass',
        timestamp: Date.now(),
        details: isBlacklisted ? {
          reason: `Event '${item.event}' is blacklisted`,
          actual: item.event,
          metadata: { blacklist: INVALID_EVENT_NAMES }
        } : undefined
      });

      if (isBlacklisted) return collector;
    }

    // Rule 5: Empty keys check (fallback)
    if (!hasEvent) {
      const keys = Object.keys(item);
      const isEmpty = !keys.length;
      const isArrayIndex = keys[0] === '0';

      collector.record({
        ruleId: BlacklistExecutor.RULES.EMPTY_KEYS,
        ruleName: 'Empty Keys Check',
        category: 'blacklist',
        status: (isEmpty || isArrayIndex) ? 'fail' : 'pass',
        timestamp: Date.now(),
        details: (isEmpty || isArrayIndex) ? {
          reason: isEmpty ? 'Object has no keys' : 'First key is array index',
          actual: keys
        } : undefined
      });
    }

    return collector;
  }
}
```

### Modified shouldIgnoreItem

```javascript
// background.js - Enhanced version

function shouldIgnoreItemWithTracking(item, trackingEnabled = true) {
  if (!trackingEnabled) {
    // Fallback to original function
    return shouldIgnoreItem(item);
  }

  const executor = new BlacklistExecutor();
  const collector = executor.execute(item);

  const hasFailures = collector.getJourney().some(r => r.status === 'fail');

  return {
    shouldIgnore: hasFailures,
    validation: {
      summary: collector.getSummary(),
      journey: collector.getJourney(),
      byCategory: collector.getByCategory()
    }
  };
}
```

### Filtered Event Storage

```javascript
// background.js

function storeFilteredEvent(tabId, item, validationResult) {
  const tabData = ensureTabData(tabId);

  if (!tabData.filteredEvents) {
    tabData.filteredEvents = [];
  }

  const failedRules = validationResult.journey.filter(r => r.status === 'fail');
  const primaryFailure = failedRules[0]; // First failure is rejection reason

  const filteredEvent = {
    capturedAt: Date.now(),
    rawPayload: item,
    eventName: getEventName(item),
    rejectedBy: primaryFailure,
    allFailures: failedRules,
    context: {
      tabId: tabId,
      url: null // Will be populated by content script if needed
    }
  };

  tabData.filteredEvents.push(filteredEvent);

  // Apply size limits from settings
  const maxFiltered = currentSettings?.ruleTracking?.maxFilteredEvents || 100;
  if (tabData.filteredEvents.length > maxFiltered) {
    tabData.filteredEvents.shift();
  }

  // Update stats
  if (!tabData.ruleStats) {
    tabData.ruleStats = {
      totalProcessed: 0,
      totalRejected: 0,
      rejectionReasons: new Map()
    };
  }

  tabData.ruleStats.totalRejected++;
  const reasonKey = primaryFailure.ruleId;
  const currentCount = tabData.ruleStats.rejectionReasons.get(reasonKey) || 0;
  tabData.ruleStats.rejectionReasons.set(reasonKey, currentCount + 1);
}
```

## Related Code Files

**Modified Files**:
- `background.js` (lines 79-144, 332-368)
- `src/rules/executors/blacklist.js` (new file)
- `src/rules/collector.js` (new file)

**New Files**:
- `src/rules/executors/blacklist.js`
- `src/rules/collector.js`
- `src/rules/types.js`

## Implementation Steps

### Step 1: Create Rule Collector
File: `src/rules/collector.js`
- Implement RuleCollector class
- Methods: record(), getSummary(), getJourney(), getByCategory()
- Export for use in executors

### Step 2: Implement Blacklist Executor
File: `src/rules/executors/blacklist.js`
- Extract validation logic from shouldIgnoreItem
- Convert to RuleExecutor pattern
- Return RuleCollector with results

### Step 3: Modify shouldIgnoreItem
File: `background.js`
- Create shouldIgnoreItemWithTracking variant
- Check ruleTracking.enabled setting
- Call BlacklistExecutor if tracking enabled
- Return both ignore decision and validation metadata

### Step 4: Enhance Message Handlers
File: `background.js` (lines 79-144)

For LH_DL_INITIAL:
```javascript
case 'LH_DL_INITIAL':
  if (tabId && msg.data?.items) {
    const tabData = ensureTabData(tabId);
    const trackingEnabled = currentSettings?.ruleTracking?.enabled;

    tabData.items = msg.data.items
      .map((item) => {
        const validationResult = shouldIgnoreItemWithTracking(item, trackingEnabled);

        if (validationResult.shouldIgnore) {
          // Store in filtered events log
          if (trackingEnabled && currentSettings?.ruleTracking?.trackFilteredEvents) {
            storeFilteredEvent(tabId, item, validationResult.validation);
          }
          return null; // Will be filtered out
        }

        tabData.eventCounter++;
        return {
          index: tabData.eventCounter,
          time: Date.now(),
          eventName: getEventName(item),
          payload: item,
          validation: trackingEnabled ? validationResult.validation : undefined
        };
      })
      .filter(item => item !== null);

    // ... rest of logic
  }
  break;
```

For LH_DL_PUSH:
```javascript
case 'LH_DL_PUSH':
  if (tabId && msg.data?.item) {
    const trackingEnabled = currentSettings?.ruleTracking?.enabled;
    const validationResult = shouldIgnoreItemWithTracking(msg.data.item, trackingEnabled);

    if (validationResult.shouldIgnore) {
      if (trackingEnabled && currentSettings?.ruleTracking?.trackFilteredEvents) {
        storeFilteredEvent(tabId, msg.data.item, validationResult.validation);
        // Broadcast filtered event to side panel
        broadcastToSidePanel({
          type: 'LH_DL_FILTERED',
          tabId,
          data: tabData.filteredEvents[tabData.filteredEvents.length - 1]
        });
      }
      return; // Event rejected
    }

    const tabData = ensureTabData(tabId);
    tabData.eventCounter++;

    const newItem = {
      index: tabData.eventCounter,
      time: Date.now(),
      eventName: getEventName(msg.data.item),
      payload: msg.data.item,
      validation: trackingEnabled ? validationResult.validation : undefined
    };

    // ... rest of logic
  }
  break;
```

### Step 5: Add Filtered Events API
File: `background.js`

New message type handler:
```javascript
case 'GET_FILTERED_EVENTS':
  {
    const requestedTabId = msg.tabId;
    const tabData = tabDataStore.get(requestedTabId);

    if (tabData?.filteredEvents) {
      sendResponse({
        filteredEvents: tabData.filteredEvents,
        stats: tabData.ruleStats
      });
    } else {
      sendResponse({ filteredEvents: [], stats: null });
    }
  }
  return true;
```

### Step 6: Settings Integration
File: `background.js`

On startup, load tracking settings:
```javascript
chrome.runtime.onStartup.addListener(async () => {
  try {
    const result = await chrome.storage.local.get('layerhub_settings');
    if (result.layerhub_settings) {
      currentSettings = result.layerhub_settings;

      // Initialize rule tracking if enabled
      if (currentSettings.ruleTracking?.enabled) {
        console.log('Rule tracking enabled');
      }
    }
  } catch (error) {
    console.error('Failed to load settings on startup:', error);
  }
});
```

### Step 7: Tab Cleanup Enhancement
File: `background.js` (lines 258-262, 267-276)

Ensure filtered events cleaned up:
```javascript
chrome.tabs.onRemoved.addListener((tabId) => {
  const tabData = tabDataStore.get(tabId);

  // Log cleanup stats if enabled
  if (currentSettings?.ruleTracking?.enabled && tabData?.ruleStats) {
    console.log(`Tab ${tabId} closed - Stats:`, tabData.ruleStats);
  }

  tabDataStore.delete(tabId);
  injectedTabs.delete(tabId);
});
```

## Todo List

- [ ] Create src/rules/collector.js with RuleCollector class
- [ ] Create src/rules/types.js with JSDoc type definitions
- [ ] Implement BlacklistExecutor in src/rules/executors/blacklist.js
- [ ] Create shouldIgnoreItemWithTracking function in background.js
- [ ] Modify LH_DL_INITIAL handler to use new tracking
- [ ] Modify LH_DL_PUSH handler to use new tracking
- [ ] Implement storeFilteredEvent function
- [ ] Add GET_FILTERED_EVENTS message handler
- [ ] Extend TabData interface with filteredEvents and ruleStats
- [ ] Add LH_DL_FILTERED broadcast message
- [ ] Update settings loading to initialize rule tracking
- [ ] Enhance tab cleanup to log stats
- [ ] Write unit tests for BlacklistExecutor
- [ ] Write unit tests for RuleCollector
- [ ] Performance test metadata overhead

## Success Criteria

1. **Rule Tracking Functional**
   - All blacklist rules tracked and reported
   - Validation metadata attached to TrackedItems
   - No impact when tracking disabled

2. **Filtered Events Logged**
   - Rejected events stored separately
   - Rejection reasons captured
   - Size limits enforced

3. **Performance Maintained**
   - <5ms overhead per event
   - No blocking operations
   - Graceful degradation under load

4. **Statistics Accurate**
   - Per-tab rejection counts correct
   - Rejection reason distribution accurate
   - Total processed count matches

5. **Backward Compatible**
   - Existing functionality unchanged when tracking disabled
   - No breaking changes to message formats
   - Side panel works with/without metadata

## Risk Assessment

### Technical Risks

**High Risk**:
- Message size limits exceeded with large metadata
  - *Mitigation*: Compress validation data, lazy load details

**Medium Risk**:
- Performance impact on high-volume sites
  - *Mitigation*: Benchmark with 1000+ events/sec, optimize hot paths

**Low Risk**:
- Settings not loaded before first event
  - *Mitigation*: Default to tracking disabled, async load settings

### Integration Risks

**Medium Risk**:
- Conflict with existing shouldIgnoreItem logic
  - *Mitigation*: Wrap, don't replace; fallback path

**Low Risk**:
- Filtered events storage exceeds quota
  - *Mitigation*: Strict size limits, LRU eviction

## Security Considerations

1. **Data Exposure**
   - Filtered events may contain sensitive data
   - *Control*: Apply same sanitization as accepted events

2. **Storage Limits**
   - Malicious page spams rejected events
   - *Control*: Max 100 filtered events per tab, FIFO

3. **Performance DoS**
   - Tracking overhead exploitable for slowdown
   - *Control*: Toggle to disable, rate limiting

## Next Steps

1. Implement RuleCollector and BlacklistExecutor
2. Test with sample events, verify metadata structure
3. Integrate with background.js message handlers
4. Proceed to Phase 03: Pagehook sanitization tracking
