# LayerHub Extension - Complete Working Workflow

**Document Version**: 1.0
**Date**: 2026-01-15
**Purpose**: Comprehensive documentation of LayerHub extension architecture and workflow

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Components](#architecture-components)
3. [Extension Initialization Flow](#extension-initialization-flow)
4. [Data Flow Pipeline](#data-flow-pipeline)
5. [Communication Patterns](#communication-patterns)
6. [Event Lifecycle](#event-lifecycle)
7. [State Management](#state-management)
8. [Key Features & Mechanisms](#key-features--mechanisms)
9. [Error Handling & Edge Cases](#error-handling--edge-cases)
10. [Performance Considerations](#performance-considerations)

---

## Overview

LayerHub is a Chrome browser extension that tracks and displays `window.dataLayer` events for analytics debugging. It uses a **multi-context architecture** to bridge the isolated content script world with the main page context where `window.dataLayer` lives.

### Core Problem Solved
Browser extensions run in isolated contexts and cannot directly access page variables like `window.dataLayer`. LayerHub solves this by:
- Injecting code into the **MAIN world** (page context) to hook into dataLayer
- Using **custom DOM events** to communicate across context boundaries
- Storing state in a **service worker** that persists across page navigations
- Displaying data in a **side panel** UI

---

## Architecture Components

### 1. Background Service Worker (`background.js`)

**Context**: Service Worker (persistent background context)
**Permissions**: `tabs`, `scripting`, `sidePanel`, `storage`

**Responsibilities**:
- Listen for extension icon clicks and open side panel
- Inject `pagehook.js` into page MAIN world
- Act as central message router between all components
- Store per-tab dataLayer state in `Map<tabId, TabData>`
- Filter and validate incoming events
- Handle tab lifecycle (navigation, close, switch)
- Manage settings and configuration

**Key Data Structures**:
```javascript
// Per-tab state storage
tabDataStore = Map {
  tabId → {
    items: Array<TrackedItem>,
    accountData: Object | null,
    lastUpdate: timestamp,
    ready: boolean,
    eventCounter: number  // Sequential event index
  }
}

// Tracked tabs set
injectedTabs = Set<tabId>
```

---

### 2. Page Hook (`pagehook.js`)

**Context**: MAIN world (injected into page, same context as `window.dataLayer`)
**Run Time**: Injected on-demand when extension icon is clicked

**Responsibilities**:
- Access `window.dataLayer` (or variants: `datalayer`, `data_layer`)
- Wrap `dataLayer.push()` method to intercept new events
- Emit initial dataLayer snapshot on injection
- Sanitize data (remove functions, symbols, circular references)
- Fall back to polling if `push` wrapping fails
- Emit account data from `window.Listenlayer.getAccount()`
- Listen for re-request events from side panel

**Key Functions**:
```javascript
sanitize(value)      // Remove non-cloneable data
hook(dataLayer)      // Wrap push() and emit initial data
emit(type, detail)   // Send custom DOM events
```

**Events Emitted**:
- `LH_DL_READY` - Hook successfully initialized
- `LH_DL_INITIAL` - Initial dataLayer snapshot
- `LH_DL_PUSH` - New item pushed to dataLayer
- `LH_DL_ACCOUNT_DATA` - Account data retrieved

---

### 3. Content Script (`content.js`)

**Context**: Isolated world (standard content script context)
**Run Time**: `document_start` on all URLs

**Responsibilities**:
- **Message Relay**: Bridge between MAIN world (page hook) and background
- Listen for custom DOM events from page hook
- Forward events to background service worker via `chrome.runtime.sendMessage`
- Handle extension context invalidation gracefully
- Forward background requests to page hook via DOM events

**Communication Flow**:
```
Page Hook (MAIN) → DOM Event → Content Script → chrome.runtime.sendMessage → Background
Background → chrome.tabs.sendMessage → Content Script → DOM Event → Page Hook
```

---

### 4. Side Panel UI (`side_panel.js`, `side_panel.html`)

**Context**: Extension side panel (separate document)
**Run Time**: When user opens side panel

**Responsibilities**:
- Display list of dataLayer events in reverse chronological order
- Show detailed event inspection with tabbed views
- Manage view state (list view, detail view, account view, settings)
- Request initial data from background on load
- Listen for real-time event updates
- Handle tab switching and display appropriate data
- Manage settings UI and persistence
- Filter events based on user configuration

**View Modes**:
- **Events List**: Table of all tracked events (index, name, time)
- **Event Detail**: Tabbed inspection of single event
  - Automatic Values, Location, Tracking, User, Time, Triggers, Conversion, Destinations, Custom, Raw, All
- **Debug View**: Validation and structure analysis
- **Account View**: Display account data from `window.Listenlayer`
- **Settings View**: Configuration panel

---

## Extension Initialization Flow

### User Action: Click Extension Icon

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER CLICKS EXTENSION ICON                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Background: chrome.action.onClicked                      │
│    - Get active tab ID                                      │
│    - Open side panel: chrome.sidePanel.open()               │
│    - Check if pagehook already injected                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Background: injectPagehook(tabId)                        │
│    - Execute chrome.scripting.executeScript()               │
│    - Target: tabId, world: "MAIN"                           │
│    - Files: ["pagehook.js"]                                 │
│    - Add tabId to injectedTabs set                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Page Hook: Execute in MAIN world                         │
│    - Check if already hooked (window.__LH_DL_HOOKED__)      │
│    - Find dataLayer: getDL()                                │
│    - Hook dataLayer.push()                                  │
│    - Emit LH_DL_INITIAL with snapshot                       │
│    - Setup polling fallback (250ms)                         │
│    - Emit LH_DL_READY                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Content Script: Listen for DOM events                    │
│    - Receive 'LH_DL_READY' event                            │
│    - Receive 'LH_DL_INITIAL' event                          │
│    - Forward to background via chrome.runtime.sendMessage   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Background: Process messages                             │
│    - LH_DL_READY: initTabData(tabId)                        │
│    - LH_DL_INITIAL: Filter, map, store items                │
│    - Broadcast to side panel                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Side Panel: init()                                       │
│    - Send SIDE_PANEL_OPENED message                         │
│    - Load settings from chrome.storage.local                │
│    - Get current active tab                                 │
│    - Request tab data: GET_TAB_DATA                         │
│    - Setup event listeners                                  │
│    - Render UI                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Pipeline

### Event Push Flow: `window.dataLayer.push(eventObject)`

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: Page JavaScript                                      │
│ window.dataLayer.push({ event: 'button_click', ... })        │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: Page Hook (MAIN world)                               │
│ - Wrapped push() intercepts call                             │
│ - Execute original push: originalPush(...args)               │
│ - For each arg:                                              │
│   - sanitize(arg) → remove functions, symbols, circular refs │
│   - emit('LH_DL_PUSH', { item: sanitizedArg })               │
│ - Update lastIndex                                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: DOM Event Boundary                                   │
│ document.dispatchEvent(                                      │
│   new CustomEvent('LH_DL_PUSH', {                            │
│     detail: { item: sanitizedData }                          │
│   })                                                         │
│ )                                                            │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 4: Content Script (Isolated world)                      │
│ - Listen: document.addEventListener('LH_DL_PUSH')            │
│ - safeSendMessage({ type: 'LH_DL_PUSH', data: e.detail })    │
│ - Check extension context validity                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 5: Background Service Worker                            │
│ - Receive: chrome.runtime.onMessage                          │
│ - Validate: shouldIgnoreItem(item)                           │
│   - Check if null/non-object                                 │
│   - Check blacklist: gtm.*, optimize.activate, etc.          │
│   - Validate event property exists and non-empty             │
│ - If valid:                                                  │
│   - ensureTabData(tabId)                                     │
│   - Increment eventCounter                                   │
│   - Create TrackedItem:                                      │
│     {                                                        │
│       index: eventCounter,                                   │
│       time: Date.now(),                                      │
│       eventName: getEventName(item),                         │
│       payload: item                                          │
│     }                                                        │
│   - Push to tabData.items                                    │
│   - Maintain max 200 items (shift oldest)                    │
│   - broadcastToSidePanel({ type: 'LH_DL_PUSH', ... })        │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 6: Side Panel UI                                        │
│ - Receive: chrome.runtime.onMessage                          │
│ - Filter by tabId (only current tab)                         │
│ - Validate item structure (index, eventName, time, payload)  │
│ - Apply settings filter: shouldShowEvent(eventName)          │
│ - pushTracked(item) → add to trackedItems array              │
│ - render() → update table with new row                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Communication Patterns

### 1. Cross-Context Communication (MAIN ↔ Isolated)

**Problem**: Content scripts cannot access page variables
**Solution**: Custom DOM Events

```javascript
// MAIN World (pagehook.js) → DOM Event
document.dispatchEvent(new CustomEvent('LH_DL_PUSH', { detail: data }));

// Isolated World (content.js) ← DOM Event
document.addEventListener('LH_DL_PUSH', (e) => {
  chrome.runtime.sendMessage({ type: 'LH_DL_PUSH', data: e.detail });
});
```

**Custom Events Used**:
- `LH_DL_READY` - Hook initialization complete
- `LH_DL_INITIAL` - Initial dataLayer snapshot
- `LH_DL_PUSH` - New dataLayer item
- `LH_DL_ACCOUNT_DATA` - Account data
- `LH_DL_REQUEST_INITIAL` - Request snapshot (side panel → page hook)
- `LH_DL_REQUEST_ACCOUNT` - Request account data

---

### 2. Extension Message Passing

**Background ↔ Content Script**:
```javascript
// Background → Content Script
chrome.tabs.sendMessage(tabId, { type: 'REQUEST_INITIAL' });

// Content Script → Background
chrome.runtime.sendMessage({ type: 'LH_DL_PUSH', data: item });
```

**Background ↔ Side Panel**:
```javascript
// Side Panel → Background
chrome.runtime.sendMessage({ type: 'GET_TAB_DATA', tabId });

// Background → Side Panel (broadcast)
chrome.runtime.sendMessage({ type: 'LH_DL_PUSH', tabId, data: item });
```

---

### 3. Message Types Reference

| Message Type | Direction | Purpose |
|-------------|-----------|---------|
| `LH_DL_READY` | Page Hook → Background | Hook initialized |
| `LH_DL_INITIAL` | Page Hook → Background | Initial snapshot |
| `LH_DL_PUSH` | Page Hook → Background → Side Panel | New event |
| `LH_DL_ACCOUNT_DATA` | Page Hook → Background → Side Panel | Account info |
| `GET_TAB_DATA` | Side Panel → Background | Request stored data |
| `REQUEST_INITIAL` | Side Panel → Background → Page Hook | Re-request snapshot |
| `REQUEST_ACCOUNT` | Side Panel → Background → Page Hook | Request account data |
| `SIDE_PANEL_OPENED` | Side Panel → Background | Panel opened |
| `TAB_SWITCHED` | Background → Side Panel | Active tab changed |
| `TAB_NAVIGATED` | Background → Side Panel | Tab navigated/reloaded |
| `SETTINGS_UPDATED` | Side Panel → Background | Settings changed |

---

## Event Lifecycle

### Complete Event Journey

```
1. Page Code Execution
   ↓
   window.dataLayer.push({ event: 'purchase', amount: 100 })

2. Page Hook Intercept (MAIN world)
   ↓
   - Wrapped push() executes
   - Original push called
   - Data sanitized (remove functions, symbols)
   - Custom DOM event emitted

3. Context Boundary Crossing
   ↓
   - DOM Event: 'LH_DL_PUSH'
   - Event detail contains sanitized data

4. Content Script Relay (Isolated world)
   ↓
   - Listen for DOM event
   - Extract event.detail
   - Forward via chrome.runtime.sendMessage

5. Background Processing
   ↓
   - Validate data (shouldIgnoreItem)
   - Extract event name (getEventName)
   - Create TrackedItem with sequential index
   - Store in tabDataStore Map
   - Broadcast to side panel

6. Side Panel Rendering
   ↓
   - Filter by current tabId
   - Validate item structure
   - Apply user settings filters
   - Add to trackedItems array
   - Render new table row
   - Update detail view if open

7. User Interaction
   ↓
   - Click event row → showDetailView
   - View tabs: Raw, Location, Tracking, etc.
   - Debug view: Structure validation
```

---

## State Management

### 1. Background State

**Per-Tab Storage** (`tabDataStore`):
```javascript
{
  items: [
    {
      index: 1,           // Sequential, never resets
      time: 1736945678000,
      eventName: 'page_view',
      payload: { event: 'page_view', ... }
    }
  ],
  accountData: { /* Listenlayer.getAccount() data */ },
  lastUpdate: 1736945678000,
  ready: false,
  eventCounter: 0  // Per-tab sequential counter
}
```

**Lifecycle Management**:
- Tab navigation: Clear data, delete from map
- Tab close: Delete from map
- Tab switch: Notify side panel
- Extension reload: All state lost (service worker restarts)

---

### 2. Side Panel State

**Local State Variables**:
```javascript
currentTabId         // Active tab being displayed
trackedItems[]       // Array of TrackedItem objects
selectedItem         // Currently selected event (detail view)
detailActiveTab      // Active tab in detail view ("Raw", "Location", etc.)
currentView          // "list" | "detail"
currentMainView      // "events" | "account" | "settings"
accountDetailViewElement  // Cached account view DOM
currentSettings      // User settings object
```

**Persistence**:
- Settings: `chrome.storage.local` (persistent)
- View state: In-memory only (lost on panel close)

---

### 3. Settings Schema

```javascript
{
  environment: {
    current: 'dev' | 'staging' | 'prod'
  },
  eventLogging: {
    enabled: true,
    maxStoredEvents: 200
  },
  filters: {
    ignoredEvents: ['gtm.js', 'gtm.dom'],
    onlyShowEvents: []  // Whitelist (empty = show all)
  },
  advanced: {
    debugMode: false
  }
}
```

---

## Key Features & Mechanisms

### 1. Data Sanitization

**Problem**: DataLayer objects can contain non-cloneable data (functions, symbols, circular refs)
**Solution**: `sanitize()` function in `pagehook.js`

```javascript
function sanitize(value, depth = 0, seen) {
  // Max depth: 6 levels
  // Remove: functions, symbols, circular references
  // Convert: BigInt → Number
  // Filter: Only keep event objects (have 'event' property)
  // Handle: Arrays and nested objects recursively
}
```

**Event Filtering Rules**:
- Only include objects with `event` property
- Arrays: filter to keep only event objects
- Objects without `event` property: return `undefined`

---

### 2. Event Filtering & Validation

**Background Validation** (`shouldIgnoreItem`):
```javascript
// Reject if:
- item is null/undefined
- item is not an object
- item has no event property or empty event
- event name is in blacklist:
  * 'item' (generic placeholder)
  * 'gtm.*' (GTM internal events)
  * 'optimize.activate' (Google Optimize)
```

**Side Panel Filtering** (`shouldShowEvent`):
```javascript
// Check settings:
- If logging disabled: hide all
- If in ignoredEvents: hide
- If onlyShowEvents not empty: show only whitelisted
```

---

### 3. Push Wrapping with Polling Fallback

**Primary Method**: Wrap `dataLayer.push()`
```javascript
const originalPush = dl.push.bind(dl);
dl.push = function(...args) {
  const result = originalPush(...args);
  args.forEach(x => emit('LH_DL_PUSH', { item: sanitize(x) }));
  return result;
};
```

**Fallback**: Polling (250ms interval)
- Detects when `push` cannot be wrapped (proxied dataLayer)
- Compares `dl.length` with `lastIndex`
- Emits missed items
- Stops polling if wrapped push works

---

### 4. Extension Context Invalidation Handling

**Problem**: Extension reloads invalidate content script contexts
**Solution**: Graceful error handling

```javascript
function safeSendMessage(message) {
  try {
    if (!chrome.runtime?.id) {
      // Extension context invalidated
      return;
    }
    chrome.runtime.sendMessage(message).catch((error) => {
      if (error.message?.includes('Extension context invalidated')) {
        return; // Silently ignore
      }
    });
  } catch (e) {
    // Extension context invalidated
  }
}
```

---

### 5. Tab Lifecycle Management

**Tab Navigation** (`onUpdated` - status: 'loading'):
```javascript
- Clear tabDataStore for tab
- Remove from injectedTabs
- Broadcast TAB_NAVIGATED to side panel
```

**Tab Completion** (`onUpdated` - status: 'complete'):
```javascript
- Check if can inject (not chrome:// page)
- Check if side panel open
- Re-inject pagehook if needed
```

**Tab Close** (`onRemoved`):
```javascript
- Delete from tabDataStore
- Delete from injectedTabs
```

**Tab Switch** (`onActivated`):
```javascript
- Broadcast TAB_SWITCHED to side panel
- Side panel requests data for new tab
```

---

### 6. Sequential Event Indexing

**Per-Tab Counter**:
- Each tab has `eventCounter` starting at 0
- Increments on each new event
- Never resets (even when items are removed for max limit)
- Provides unique, chronological event ID

**Benefits**:
- Identify event order across page navigation
- Debug event sequence issues
- Track event volume

---

### 7. Account Data Integration

**Source**: `window.Listenlayer.getAccount()`

**Flow**:
```javascript
// Page Hook
if (window.Listenlayer?.getAccount) {
  accountData = window.Listenlayer.getAccount();
  emit('LH_DL_ACCOUNT_DATA', { accountData });
}

// On-demand request
document.addEventListener('LH_DL_REQUEST_ACCOUNT', () => {
  emitAccountData();
});
```

**Side Panel Display**:
- Dropdown menu → Account Details
- Custom view component from `src/account.js`
- Displays user/account metadata

---

## Error Handling & Edge Cases

### 1. Restricted Pages

**Problem**: Cannot inject scripts on `chrome://`, `edge://`, `about:` pages
**Detection**: `canInjectOnTab(tab)` checks URL protocol
**Handling**:
- Show "Extension cannot run on this page" message
- Skip injection attempt

---

### 2. Late DataLayer Initialization

**Problem**: DataLayer might not exist when pagehook runs
**Solution**: Polling with timeout
```javascript
if (!hook(getDL())) {
  const iv = setInterval(() => {
    const ok = hook(getDL());
    if (ok || Date.now() - startedAt > 20000) {
      clearInterval(iv);
    }
  }, 300);
}
```
**Timeout**: 20 seconds

---

### 3. DataLayer Variants

**Support Multiple Names**:
```javascript
const getDL = () =>
  window.dataLayer ||
  window.datalayer ||
  window.data_layer;
```

---

### 4. Malformed Items

**Background Validation**:
- Filter items without `event` property
- Filter GTM internal events
- Filter placeholder events

**Side Panel Validation**:
- Check for required properties: `index`, `eventName`, `time`, `payload`
- Log warnings for malformed items
- Skip rendering invalid items

---

### 5. Extension Reload During Session

**Problem**: Service worker restarts, content scripts become orphaned
**Detection**: `chrome.runtime?.id` becomes undefined
**Handling**:
- Content script: Silently fail message sends
- Side panel: May need manual refresh
- State: All in-memory data lost

---

### 6. Circular References & Functions

**Problem**: DataLayer can contain non-serializable data
**Solution**: `sanitize()` function
- Use `WeakSet` to track seen objects
- Return `undefined` for circular refs
- Remove functions and symbols
- Limit depth to 6 levels

---

## Performance Considerations

### 1. Memory Management

**Max Items Limit**: 200 events per tab
```javascript
if (tabData.items.length > 200) {
  tabData.items.shift(); // Remove oldest
}
```

**Tab Cleanup**: Delete data on tab close/navigation

---

### 2. Event Filtering

**Early Filtering**: Validate in background before broadcasting
- Reduces message passing overhead
- Prevents side panel from processing invalid data

---

### 3. Polling Fallback Optimization

**Dynamic Polling**:
- Start polling immediately
- Stop polling if push wrapper works
- Prevent duplicate events

**Interval**: 250ms (balance between responsiveness and CPU usage)

---

### 4. Sanitization Efficiency

**Depth Limiting**: Max 6 levels deep
- Prevents infinite recursion
- Reduces serialization size

**Type Checking**: Early return for primitives
- Skip processing for strings, numbers, booleans

---

### 5. Render Optimization

**Reverse Order Rendering**: Newest events first
```javascript
for (let i = trackedItems.length - 1; i >= 0; i--) {
  // Render from end to start
}
```

**Conditional Rendering**: Skip malformed items early

---

## Workflow Summary Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     LayerHub Architecture                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  Side Panel  │◄────────┤  Background  │────────►│ Content.js   │
│  (UI View)   │         │  (Service    │         │ (Relay)      │
│              │         │   Worker)    │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
      ▲                         ▲                         ▲
      │                         │                         │
      │                         │                         │
      │                  chrome.runtime                   │
      │                    messages                  DOM Events
      │                         │                         │
      └─────────────────────────┴─────────────────────────┘
                                │
                         ┌──────────────┐
                         │  Pagehook.js │
                         │ (MAIN World) │
                         │              │
                         └──────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  window.dataLayer     │
                    │  (Page JavaScript)    │
                    └───────────────────────┘

Data Flow:
  Page dataLayer.push()
  → Page Hook (sanitize, emit DOM event)
  → Content Script (relay to background)
  → Background (validate, store, broadcast)
  → Side Panel (filter, render)

Context Boundaries:
  - MAIN World: Page Hook has direct access to window.dataLayer
  - Isolated World: Content Script cannot access page variables
  - Extension Context: Background, Side Panel isolated from page
```

---

## Conclusion

LayerHub demonstrates a robust multi-context architecture for Chrome extensions that need to bridge the isolated extension environment with the main page context. Key design patterns include:

1. **Multi-layer communication**: DOM Events → chrome.runtime messages
2. **Centralized state management**: Background service worker as single source of truth
3. **Defensive programming**: Graceful handling of context invalidation, malformed data
4. **Performance optimization**: Event filtering, memory limits, efficient sanitization
5. **User-centric UI**: Real-time updates, detailed inspection, flexible filtering

The extension successfully solves the challenge of accessing page variables from an isolated extension context while maintaining security boundaries and providing a rich debugging experience.

---

**End of Document**
