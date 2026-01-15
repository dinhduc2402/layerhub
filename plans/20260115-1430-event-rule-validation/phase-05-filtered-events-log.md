# Phase 05: Filtered Events Log

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**:
  - [Phase 01: Rule Metadata Architecture](./phase-01-rule-metadata-architecture.md)
  - [Phase 02: Background Rule Tracking](./phase-02-background-rule-tracking.md)
- **Related Docs**: [Extension Workflow](../20260115-extension-workflow-documentation.md)

## Overview

**Date**: 2026-01-15
**Description**: Implement persistent storage and management for filtered/rejected events
**Priority**: Medium
**Implementation Status**: Not Started
**Review Status**: Not Reviewed

## Key Insights

### Current Rejection Flow

Events rejected at background layer (shouldIgnoreItem):
- Currently discarded silently
- No log of what was filtered
- No visibility into filtering decisions
- No way to debug missing events

### Storage Constraints

Chrome extension storage limits:
- `chrome.storage.local`: ~5MB total (browser-dependent)
- Message size limit: ~64MB (practical: keep under 1MB)
- IndexedDB available but requires async handling

## Requirements

### Functional Requirements

1. **Persistent Storage**
   - Store filtered events in chrome.storage.local
   - Maintain across browser sessions
   - Per-tab organization
   - TTL-based expiration

2. **Size Management**
   - Configurable max filtered events per tab
   - LRU eviction when limit reached
   - Automatic cleanup on tab close
   - Size estimation before storage

3. **Retrieval API**
   - Get filtered events by tab ID
   - Get filtered events by rejection reason
   - Get all filtered events (aggregated)
   - Export filtered events

4. **Statistics Tracking**
   - Per-tab rejection counts
   - Global rejection statistics
   - Rejection reasons distribution
   - Temporal patterns (rejections over time)

5. **User Controls**
   - Enable/disable filtered event logging
   - Clear filtered events log
   - Adjust retention limits
   - Export filtered events

### Non-Functional Requirements

1. **Performance**: Storage operations <50ms
2. **Storage Efficiency**: <100KB per 50 filtered events
3. **Reliability**: No data loss on extension reload

## Architecture

### Storage Schema

```javascript
// chrome.storage.local structure

const STORAGE_SCHEMA = {
  // Per-tab filtered events (ephemeral - cleared on tab close)
  'filtered_events_tab_<tabId>': {
    tabId: number,
    events: FilteredEvent[],
    stats: {
      totalRejected: number,
      rejectionReasons: { [ruleId: string]: number },
      firstRejection: timestamp,
      lastRejection: timestamp
    }
  },

  // Global filtered events (persistent across sessions)
  'filtered_events_global': {
    events: FilteredEvent[],  // Most recent 100 across all tabs
    stats: {
      totalRejected: number,
      rejectionReasons: { [ruleId: string]: number },
      byTab: { [tabId: string]: number }
    },
    lastCleanup: timestamp
  },

  // Configuration
  'filtered_events_config': {
    enabled: boolean,
    maxPerTab: number,              // Default: 100
    maxGlobal: number,              // Default: 500
    persistAcrossSessions: boolean, // Default: false
    ttlHours: number,               // Default: 24
    autoCleanup: boolean            // Default: true
  }
};
```

### FilteredEvent Structure (Enhanced)

```javascript
interface FilteredEvent {
  id: string;                 // Unique ID (timestamp + random)
  capturedAt: number;         // Timestamp
  tabId: number;              // Tab where event occurred
  url: string;                // Page URL
  eventName?: string;         // Extracted event name
  rawPayload: object;         // Original data
  rejectedBy: RuleResult;     // Primary rejection rule
  allFailures: RuleResult[];  // All failed rules
  context: {
    tabId: number;
    windowId: number;
    userAgent?: string;
  };
  metadata?: {
    sessionId?: string;       // Browser session ID
    pageLoadTime?: number;    // Time since page load
    eventSequence?: number;   // Event number in sequence
  };
}
```

### Storage Manager

```javascript
// src/storage/filtered-events-storage.js

class FilteredEventsStorage {
  constructor() {
    this.config = null;
    this.cache = new Map(); // tabId -> FilteredEvent[]
  }

  async initialize() {
    const result = await chrome.storage.local.get('filtered_events_config');
    this.config = result.filtered_events_config || this.getDefaultConfig();
  }

  getDefaultConfig() {
    return {
      enabled: true,
      maxPerTab: 100,
      maxGlobal: 500,
      persistAcrossSessions: false,
      ttlHours: 24,
      autoCleanup: true
    };
  }

  async storeFilteredEvent(tabId, filteredEvent) {
    if (!this.config.enabled) return;

    // Add to cache
    if (!this.cache.has(tabId)) {
      this.cache.set(tabId, []);
    }

    const events = this.cache.get(tabId);
    events.push(filteredEvent);

    // Apply size limit
    if (events.length > this.config.maxPerTab) {
      events.shift(); // Remove oldest
    }

    // Persist to storage (debounced)
    await this.persistTabEvents(tabId, events);

    // Update global log if enabled
    if (this.config.persistAcrossSessions) {
      await this.addToGlobalLog(filteredEvent);
    }
  }

  async persistTabEvents(tabId, events) {
    const key = `filtered_events_tab_${tabId}`;

    // Calculate stats
    const stats = this.calculateStats(events);

    await chrome.storage.local.set({
      [key]: {
        tabId,
        events,
        stats,
        lastUpdate: Date.now()
      }
    });
  }

  async addToGlobalLog(event) {
    const result = await chrome.storage.local.get('filtered_events_global');
    const globalLog = result.filtered_events_global || {
      events: [],
      stats: {
        totalRejected: 0,
        rejectionReasons: {},
        byTab: {}
      },
      lastCleanup: Date.now()
    };

    globalLog.events.push(event);

    // Apply size limit
    if (globalLog.events.length > this.config.maxGlobal) {
      globalLog.events.shift();
    }

    // Update stats
    globalLog.stats.totalRejected++;
    const ruleId = event.rejectedBy.ruleId;
    globalLog.stats.rejectionReasons[ruleId] =
      (globalLog.stats.rejectionReasons[ruleId] || 0) + 1;
    globalLog.stats.byTab[event.tabId] =
      (globalLog.stats.byTab[event.tabId] || 0) + 1;

    await chrome.storage.local.set({ filtered_events_global: globalLog });
  }

  async getFilteredEvents(tabId) {
    const key = `filtered_events_tab_${tabId}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || { events: [], stats: null };
  }

  async getAllFilteredEvents() {
    const result = await chrome.storage.local.get('filtered_events_global');
    return result.filtered_events_global || { events: [], stats: null };
  }

  async clearTabEvents(tabId) {
    const key = `filtered_events_tab_${tabId}`;
    await chrome.storage.local.remove(key);
    this.cache.delete(tabId);
  }

  async clearAllEvents() {
    const keys = await chrome.storage.local.get(null);
    const filteredKeys = Object.keys(keys).filter(k =>
      k.startsWith('filtered_events_tab_') || k === 'filtered_events_global'
    );
    await chrome.storage.local.remove(filteredKeys);
    this.cache.clear();
  }

  calculateStats(events) {
    const stats = {
      totalRejected: events.length,
      rejectionReasons: {},
      firstRejection: events[0]?.capturedAt || Date.now(),
      lastRejection: events[events.length - 1]?.capturedAt || Date.now()
    };

    events.forEach(event => {
      const ruleId = event.rejectedBy.ruleId;
      stats.rejectionReasons[ruleId] = (stats.rejectionReasons[ruleId] || 0) + 1;
    });

    return stats;
  }

  async cleanup() {
    if (!this.config.autoCleanup) return;

    const now = Date.now();
    const ttlMs = this.config.ttlHours * 60 * 60 * 1000;

    // Cleanup global log
    const result = await chrome.storage.local.get('filtered_events_global');
    if (result.filtered_events_global) {
      const globalLog = result.filtered_events_global;
      globalLog.events = globalLog.events.filter(
        e => now - e.capturedAt < ttlMs
      );
      globalLog.lastCleanup = now;
      await chrome.storage.local.set({ filtered_events_global: globalLog });
    }
  }
}

// Singleton instance
const filteredEventsStorage = new FilteredEventsStorage();
```

### Background Integration

```javascript
// background.js - Integrate with existing storeFilteredEvent

async function storeFilteredEvent(tabId, item, validationResult) {
  const tabData = ensureTabData(tabId);

  // In-memory storage (for immediate access)
  if (!tabData.filteredEvents) {
    tabData.filteredEvents = [];
  }

  const failedRules = validationResult.journey.filter(r => r.status === 'fail');
  const primaryFailure = failedRules[0];

  const filteredEvent = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    capturedAt: Date.now(),
    tabId: tabId,
    url: null, // Will be populated if available
    eventName: getEventName(item),
    rawPayload: item,
    rejectedBy: primaryFailure,
    allFailures: failedRules,
    context: {
      tabId: tabId,
      windowId: null // Will be populated
    }
  };

  tabData.filteredEvents.push(filteredEvent);

  // Apply in-memory limit
  const maxFiltered = currentSettings?.ruleTracking?.maxFilteredEvents || 100;
  if (tabData.filteredEvents.length > maxFiltered) {
    tabData.filteredEvents.shift();
  }

  // Update in-memory stats
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

  // Persist to storage (async, non-blocking)
  if (filteredEventsStorage.config?.enabled) {
    filteredEventsStorage.storeFilteredEvent(tabId, filteredEvent).catch(err => {
      console.error('Failed to persist filtered event:', err);
    });
  }
}

// Initialize storage on startup
chrome.runtime.onStartup.addListener(async () => {
  await filteredEventsStorage.initialize();

  // Schedule cleanup
  if (filteredEventsStorage.config.autoCleanup) {
    setInterval(() => {
      filteredEventsStorage.cleanup().catch(console.error);
    }, 60 * 60 * 1000); // Every hour
  }
});

// Cleanup on tab close
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const tabData = tabDataStore.get(tabId);

  if (currentSettings?.ruleTracking?.enabled && tabData?.ruleStats) {
    console.log(`Tab ${tabId} closed - Stats:`, tabData.ruleStats);
  }

  tabDataStore.delete(tabId);
  injectedTabs.delete(tabId);

  // Clear persisted filtered events for this tab
  await filteredEventsStorage.clearTabEvents(tabId).catch(console.error);
});
```

## Related Code Files

**Modified Files**:
- `background.js` (storeFilteredEvent, onStartup, onRemoved)

**New Files**:
- `src/storage/filtered-events-storage.js`

## Implementation Steps

### Step 1: Create Storage Manager
File: `src/storage/filtered-events-storage.js`
- Implement FilteredEventsStorage class
- Methods: storeFilteredEvent, getFilteredEvents, clearEvents, cleanup
- Configuration management

### Step 2: Storage Schema Setup
File: `src/storage/filtered-events-storage.js`
- Define storage keys and structure
- Implement default configuration
- Add migration logic for schema updates

### Step 3: Background Integration
File: `background.js`
- Import FilteredEventsStorage
- Initialize on startup
- Call storage methods in storeFilteredEvent
- Add cleanup on tab close

### Step 4: Message Handlers
File: `background.js`
- Enhance GET_FILTERED_EVENTS handler to use storage
- Add CLEAR_FILTERED_EVENTS handler
- Add GET_FILTERED_STATS handler
- Add EXPORT_FILTERED_EVENTS handler

### Step 5: Settings Integration
File: `src/settings.js`
- Add filtered events config to settings schema
- Validation for maxPerTab, maxGlobal, ttlHours
- UI controls for filtered events settings

### Step 6: Export Functionality
File: `src/storage/filtered-events-storage.js`
- Implement exportToJSON method
- Implement exportToCSV method
- Add download trigger

### Step 7: Cleanup Scheduler
File: `background.js`
- Schedule periodic cleanup (every hour)
- TTL-based event removal
- Storage quota monitoring

## Todo List

- [ ] Create src/storage/ directory
- [ ] Implement FilteredEventsStorage class
- [ ] Define storage schema and keys
- [ ] Implement storeFilteredEvent method
- [ ] Implement getFilteredEvents method
- [ ] Implement clearEvents methods
- [ ] Implement cleanup method
- [ ] Add storage initialization to background.js
- [ ] Enhance storeFilteredEvent in background.js
- [ ] Add storage persistence calls
- [ ] Implement GET_FILTERED_EVENTS handler enhancement
- [ ] Add CLEAR_FILTERED_EVENTS handler
- [ ] Add GET_FILTERED_STATS handler
- [ ] Add cleanup scheduler to onStartup
- [ ] Integrate with tab close cleanup
- [ ] Add settings schema for filtered events config
- [ ] Implement export methods
- [ ] Add storage quota monitoring
- [ ] Write unit tests for storage manager
- [ ] Test TTL cleanup

## Success Criteria

1. **Persistent Storage Works**
   - Filtered events stored in chrome.storage.local
   - Events survive browser restart (if configured)
   - No data loss on extension reload

2. **Size Limits Enforced**
   - Per-tab limit respected
   - Global limit respected
   - LRU eviction functional

3. **Performance Acceptable**
   - Storage operations <50ms
   - No blocking on main thread
   - Efficient cleanup

4. **Statistics Accurate**
   - Rejection counts correct
   - Reasons distribution accurate
   - TTL cleanup works

5. **User Controls Functional**
   - Can enable/disable logging
   - Can clear logs
   - Can adjust limits
   - Can export data

## Risk Assessment

### Technical Risks

**High Risk**:
- Storage quota exceeded
  - *Mitigation*: Monitor quota, aggressive size limits, cleanup

**Medium Risk**:
- Storage operations slow down extension
  - *Mitigation*: Async operations, debouncing, caching

**Low Risk**:
- Data corruption on concurrent writes
  - *Mitigation*: Atomic operations, version stamping

### Data Risks

**High Risk**:
- Sensitive data in filtered events
  - *Mitigation*: Same sanitization as accepted events

**Medium Risk**:
- Storage quota fills up, prevents other data
  - *Mitigation*: Reserved quota for critical data

## Security Considerations

1. **Data Sanitization**
   - Apply sanitization to filtered events before storage
   - *Control*: Use same sanitize() function

2. **Storage Limits**
   - Prevent malicious overflow attacks
   - *Control*: Strict size limits, quota monitoring

3. **Data Exposure**
   - Filtered events contain rejected data
   - *Control*: User must enable explicitly, clear on demand

4. **Cross-Site Data Leakage**
   - Events from different domains stored together
   - *Control*: Include origin in FilteredEvent, per-origin export

## Next Steps

1. Implement FilteredEventsStorage class
2. Test storage operations with sample data
3. Integrate with background.js
4. Add settings UI controls
5. Proceed to Phase 06: Rule analytics dashboard

## Unresolved Questions

1. Should filtered events persist in incognito mode?
2. Maximum storage size before warning user?
3. Include screenshots/DOM snapshots with filtered events?
4. Allow users to "promote" filtered events to accepted?
5. Synchronize filtered events across devices (chrome.storage.sync)?
