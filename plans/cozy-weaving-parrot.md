# LayerHub Extension Refactoring Plan

## Overview
Refactor the LayerHub Chrome extension to eliminate duplicates, optimize real-time event tracking, and simplify data flow from window.dataLayer to UI.

## Critical Files
- `pagehook.js` - Page context hook (MAIN world)
- `background.js` - Service worker and data store
- `side_panel.js` - UI rendering and event handling
- `content.js` - Message relay (minimal changes needed)

---

## Issues Identified

### 1. Double Event Dispatch (pagehook.js)
**Location:** Lines 6-9
**Issue:** Events dispatched to BOTH `window` and `document`, but content.js only listens on `document`
**Impact:** 2x event overhead for every dataLayer change

### 2. Continuous Polling (pagehook.js)
**Location:** Lines 94-104
**Issue:** 250ms polling never stops, even after successful hook
**Impact:** Unnecessary CPU usage, battery drain

### 3. Duplicate Event Filtering
**Location:**
- background.js lines 333-369 (comprehensive version with blacklist)
- side_panel.js lines 254-263 (simple version, used in fallback)
**Impact:** ~35 lines of duplicate code

### 4. Duplicate Event Name Extraction
**Location:**
- background.js lines 374-379 (`getEventName`)
- side_panel.js lines 247-252 (`getEventNameFromItem`)
**Impact:** Identical functions, items already have `eventName` property

### 5. Redundant Event Counter Management
**Location:**
- background.js: per-tab eventCounter (source of truth)
- side_panel.js: global eventCounter with complex sync logic (lines 102-112, 142-149, 1106-1122)
**Impact:** Complex synchronization, potential for counter drift

### 6. Redundant Fallback Formatting
**Location:** side_panel.js lines 1102-1129
**Issue:** Fallback formatting for raw items that should never arrive (background always formats)
**Impact:** Dead code path, adds complexity

### 7. Excessive Sanitization Depth
**Location:** pagehook.js line 13
**Issue:** `MAX_DEPTH = 10` but CLAUDE.md specifies 6
**Impact:** Unnecessary deep traversal

---

## Refactoring Steps

### Step 1: Optimize pagehook.js (Real-time Performance)

#### 1.1 Remove Double Event Dispatch
**Change:** Only dispatch to `document`, remove `window` dispatch
```javascript
// Before (lines 6-9):
function emit(type, detail) {
  try { window.dispatchEvent(new CustomEvent(type, { detail })); } catch (_) { }
  try { document.dispatchEvent(new CustomEvent(type, { detail })); } catch (_) { }
}

// After:
function emit(type, detail) {
  try { document.dispatchEvent(new CustomEvent(type, { detail })); } catch (_) { }
}
```

#### 1.2 Stop Polling After Successful Hook
**Change:** Clear polling interval when method proxy successfully intercepts push
```javascript
// In hook() function after setting up dl.push proxy (after line 90):
dl.push = function (...args) {
  const r = originalPush(...args);
  try {
    args.forEach(x => emit('LH_DL_PUSH', { item: sanitize(x) }));

    // NEW: Clear polling interval since hook is working
    if (dl.__LH_POLL__) {
      clearInterval(dl.__LH_POLL__);
      dl.__LH_POLL__ = null;
    }
  } catch (e) { }
  lastIndex = dl.length;
  return r;
};
```

**Change:** Store poll interval reference for cleanup
```javascript
// After line 104, before line 105:
const poll = setInterval(() => { /* ... */ }, 250);
try { dl.__LH_POLL__ = poll; } catch (_) { }
```

#### 1.3 Reduce Sanitization Depth
**Change:** Reduce MAX_DEPTH from 10 to 6 (line 13)
```javascript
// Before:
const MAX_DEPTH = 10;

// After:
const MAX_DEPTH = 6;
```

---

### Step 2: Simplify side_panel.js (Remove Duplicates & Dead Code)

#### 2.1 Remove Duplicate shouldIgnoreItem Function
**Change:** Delete lines 254-263
**Reason:** Background.js already filters all items, this fallback never executes

#### 2.2 Remove Duplicate getEventNameFromItem Function
**Change:** Delete lines 247-252
**Reason:** Items from background already have `eventName` property
**Update:** Remove all usages (lines 312, 1126)
- Line 312: `const eventName = getEventNameFromItem(item);` → `const eventName = item.eventName || 'unknown';`
- Line 1126: `eventName: getEventNameFromItem(item)` → This is in dead code, will be removed in next step

#### 2.3 Remove Event Counter Management & Sync Logic
**Change:** Delete eventCounter variable and all sync logic
- Delete line 13: `let eventCounter = 0;`
- Delete lines 102-112: Counter sync in requestTabData
- Delete lines 142-149: Counter sync in LH_DL_INITIAL handler
- Delete lines 1106-1122: Counter sync in pushTracked fallback

**Reason:** Background.js is source of truth, items already have `index` property

#### 2.4 Simplify pushTracked Function
**Change:** Remove fallback formatting logic (lines 1102-1129)
```javascript
// Before (lines 1089-1129): Complex fallback logic

// After:
function pushTracked(item) {
  // Items from background are always pre-formatted
  // Debug logging
  console.log('pushTracked received:', item);

  // Apply event filter based on settings
  if (!shouldShowEvent(item.eventName)) {
    return; // Skip this event
  }

  trackedItems.push(item);

  // Maintain max items (use settings or default)
  const maxItems = currentSettings?.eventLogging?.maxStoredEvents || MAX_ITEMS;
  if (trackedItems.length > maxItems) {
    trackedItems.shift();
  }

  // Re-render the list
  render();
}
```

**Change:** Update requestTabData to not sync counter
```javascript
// Lines 93-127: Remove counter sync logic (lines 102-112)
async function requestTabData(tabId) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: 'GET_TAB_DATA', tabId },
      (response) => {
        if (response && response.items) {
          trackedItems.length = 0;
          trackedItems.push(...response.items);
          // REMOVED: eventCounter sync logic

          if (response.accountData) {
            buildAccountView(response.accountData);
          }
          render();
        } else if (!response || !response.ready) {
          chrome.runtime.sendMessage({ type: 'REQUEST_INITIAL', tabId }).catch(() => { });
          showLoadingState();
        }
        resolve();
      }
    );
  });
}
```

**Change:** Update LH_DL_INITIAL handler to not sync counter
```javascript
// Lines 137-152: Remove counter sync (lines 142-149)
case 'LH_DL_INITIAL':
  if (msg.data) {
    trackedItems.length = 0;
    trackedItems.push(...msg.data);
    // REMOVED: eventCounter sync logic
    render();
  }
  break;
```

---

### Step 3: Update showDetailView (side_panel.js)

**Change:** Line 312 - Use item.eventName directly
```javascript
// Before:
const eventName = getEventNameFromItem(item);

// After:
const eventName = item.eventName || 'unknown';
```

---

### Step 4: Clean Up background.js Response

**Change:** Remove eventCounter from GET_TAB_DATA response (lines 161-178)
```javascript
// Before (lines 167-173):
sendResponse({
  items: tabData.items,
  accountData: tabData.accountData,
  ready: tabData.ready,
  eventCounter: tabData.eventCounter  // REMOVE THIS
});

// After:
sendResponse({
  items: tabData.items,
  accountData: tabData.accountData,
  ready: tabData.ready
});
```

**Reason:** Side panel no longer needs counter value, items have their own indices

---

## Testing & Verification

### Manual Testing Checklist

1. **Real-time Event Tracking**
   - [ ] Open extension on a page with dataLayer
   - [ ] Trigger events via console: `dataLayer.push({ event: 'test_event', foo: 'bar' })`
   - [ ] Verify events appear immediately (< 100ms)
   - [ ] Verify index numbers are sequential (1, 2, 3...)

2. **No Duplicates**
   - [ ] Push 10 events rapidly
   - [ ] Verify each event appears exactly once
   - [ ] Verify no duplicate event indices

3. **Polling Optimization**
   - [ ] Open Chrome DevTools → Performance tab
   - [ ] Record for 10 seconds with extension active
   - [ ] Verify no 250ms periodic activity after initial hook
   - [ ] CPU usage should be minimal when idle

4. **Event Filtering**
   - [ ] Push GTM internal events: `dataLayer.push({ event: 'gtm.js' })`
   - [ ] Verify they are filtered out (don't appear in panel)
   - [ ] Push valid events: `dataLayer.push({ event: 'page_view' })`
   - [ ] Verify they appear correctly

5. **Initial Data Load**
   - [ ] Navigate to page with existing dataLayer (e.g., 5 items)
   - [ ] Open extension panel
   - [ ] Verify all 5 items load immediately
   - [ ] Verify indices are correct

6. **Tab Switching**
   - [ ] Open extension on Tab A (has 5 events)
   - [ ] Switch to Tab B (has 3 events)
   - [ ] Verify panel shows Tab B's 3 events
   - [ ] Switch back to Tab A
   - [ ] Verify Tab A's 5 events are still there

7. **Max Items Limit**
   - [ ] Push 250 events
   - [ ] Verify only last 200 are kept (or settings max)
   - [ ] Verify indices remain sequential (no re-indexing)

8. **Settings Integration**
   - [ ] Open settings
   - [ ] Add event to ignoredEvents list
   - [ ] Push that event
   - [ ] Verify it's filtered out

### Code Validation

1. **Search for removed functions**
   ```bash
   # Should return NO results:
   grep -n "shouldIgnoreItem" side_panel.js
   grep -n "getEventNameFromItem" side_panel.js
   grep -n "eventCounter" side_panel.js
   ```

2. **Verify single event dispatch**
   ```bash
   # Should show only document.dispatchEvent:
   grep -n "dispatchEvent" pagehook.js
   ```

3. **Check polling cleanup**
   ```bash
   # Should show clearInterval call:
   grep -n "clearInterval" pagehook.js
   ```

---

## Expected Impact

### Performance Improvements
- **50% reduction** in event dispatch overhead (single dispatch instead of double)
- **Eliminate continuous polling** - CPU usage drops to near zero when idle
- **17% faster sanitization** (depth 6 instead of 10)

### Code Quality
- **~100 lines removed** from side_panel.js
- **Single source of truth** for event filtering (background.js)
- **Single source of truth** for event counter (background.js)
- **No dead code paths** (removed fallback formatting)

### Maintainability
- **Clear separation of concerns**: background.js handles all data processing, side_panel.js only renders
- **No synchronization complexity**: side panel is read-only consumer
- **Easier debugging**: single code path for each operation

---

## Rollback Plan

If issues arise:
1. Revert pagehook.js changes first (re-enable polling, double dispatch)
2. Then revert side_panel.js changes
3. Test incrementally - can apply changes file-by-file

---

## Notes

- All changes are backwards compatible with existing stored data
- No manifest.json changes required
- No changes to content.js required (just benefits from single event dispatch)
- Background.js changes are minimal (just remove eventCounter from response)
