# Phase 04: UI Rule Display

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**:
  - [Phase 01: Rule Metadata Architecture](./phase-01-rule-metadata-architecture.md)
  - [Phase 02: Background Rule Tracking](./phase-02-background-rule-tracking.md)
  - [Phase 03: Pagehook Sanitization Tracking](./phase-03-pagehook-sanitization-tracking.md)
- **Related Docs**: [Extension Workflow](../20260115-extension-workflow-documentation.md)

## Overview

**Date**: 2026-01-15
**Description**: Create UI components to display rule validation results in side panel
**Priority**: High
**Implementation Status**: Not Started
**Review Status**: Not Reviewed

## Key Insights

### Current Side Panel Structure (from research)

**File**: `side_panel.js`

**Existing Views**:
1. Events List (lines 480-532)
2. Event Detail with tabs (lines 534-754)
   - Event Detail mode: Auto, Location, Tracking, User, Time, Trigger, Conversion, Destinations, Custom, Raw, All
   - Debug mode: Structure validation display
3. Account View
4. Settings View

**Current Debug View** (lines 756-813):
- Event structure validation
- DOM context
- Tracking details
- Complete event data

### Design Goals

1. Show validation journey for each event
2. Display pass/fail status visually
3. Integrate with existing debug view
4. Add new "Validation" tab to event detail
5. Show filtered events separately

## Requirements

### Functional Requirements

1. **Validation Tab in Event Detail**
   - Show all rules applied to event
   - Visual indicators (✓ pass, ✗ fail, ⚠ warning)
   - Group rules by category
   - Expandable details for failures

2. **List View Indicators**
   - Visual badge showing validation score
   - Color coding (green=100%, yellow=warnings, red=failures)
   - Tooltip with summary

3. **Enhanced Debug View**
   - Integrate rule results
   - Show sanitization metadata
   - Display rule execution timeline

4. **Filtered Events View**
   - Separate section for rejected events
   - Show rejection reason
   - Link to rule documentation
   - Option to temporarily allow

5. **Rule Analytics**
   - Summary statistics
   - Most common failures
   - Validation score distribution

### Non-Functional Requirements

1. **Performance**: Render <100ms for 200 events with metadata
2. **Usability**: Clear visual hierarchy, intuitive navigation
3. **Responsive**: Adapt to side panel width constraints

## Architecture

### New UI Components

```javascript
// Validation tab component
function createValidationTab(validationMetadata) {
  const container = document.createElement('div');
  container.className = 'dtl-validation-tab';

  // Summary card
  const summary = createValidationSummary(validationMetadata.summary);
  container.appendChild(summary);

  // Rules by category
  Object.entries(validationMetadata.byCategory).forEach(([category, rules]) => {
    const section = createCategorySection(category, rules);
    container.appendChild(section);
  });

  // Timeline view
  const timeline = createValidationTimeline(validationMetadata.journey);
  container.appendChild(timeline);

  return container;
}

// Validation summary card
function createValidationSummary(summary) {
  const card = document.createElement('div');
  card.className = 'dtl-validation-summary';

  const score = summary.score || 100;
  const scoreClass = score === 100 ? 'perfect' : score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error';

  card.innerHTML = `
    <div class="dtl-validation-score ${scoreClass}">
      <div class="score-value">${score}</div>
      <div class="score-label">Validation Score</div>
    </div>
    <div class="dtl-validation-stats">
      <div class="stat">
        <span class="stat-label">Total Rules</span>
        <span class="stat-value">${summary.totalRules}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Passed</span>
        <span class="stat-value passed">✓ ${summary.passedRules}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Failed</span>
        <span class="stat-value failed">✗ ${summary.failedRules}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Warnings</span>
        <span class="stat-value warning">⚠ ${summary.warnings}</span>
      </div>
    </div>
  `;

  return card;
}

// Category section
function createCategorySection(category, rules) {
  const section = document.createElement('details');
  section.className = 'dtl-validation-category';
  section.open = rules.some(r => r.status === 'fail');

  const summary = document.createElement('summary');
  summary.className = 'dtl-validation-category-header';

  const passCount = rules.filter(r => r.status === 'pass').length;
  const failCount = rules.filter(r => r.status === 'fail').length;
  const warnCount = rules.filter(r => r.status === 'warn').length;

  summary.innerHTML = `
    <span class="category-name">${formatCategoryName(category)}</span>
    <span class="category-stats">
      ${failCount > 0 ? `<span class="failed">✗ ${failCount}</span>` : ''}
      ${warnCount > 0 ? `<span class="warning">⚠ ${warnCount}</span>` : ''}
      <span class="passed">✓ ${passCount}</span>
    </span>
  `;

  const content = document.createElement('div');
  content.className = 'dtl-validation-rules';

  rules.forEach(rule => {
    const ruleElement = createRuleElement(rule);
    content.appendChild(ruleElement);
  });

  section.appendChild(summary);
  section.appendChild(content);

  return section;
}

// Individual rule element
function createRuleElement(rule) {
  const ruleDiv = document.createElement('div');
  ruleDiv.className = `dtl-validation-rule status-${rule.status}`;

  const statusIcon = {
    pass: '✓',
    fail: '✗',
    warn: '⚠',
    skip: '○'
  }[rule.status];

  ruleDiv.innerHTML = `
    <div class="rule-header">
      <span class="rule-status ${rule.status}">${statusIcon}</span>
      <span class="rule-name">${rule.ruleName}</span>
      <span class="rule-id">${rule.ruleId}</span>
    </div>
  `;

  // Add details if failed or warned
  if (rule.details && (rule.status === 'fail' || rule.status === 'warn')) {
    const details = document.createElement('div');
    details.className = 'rule-details';

    if (rule.details.reason) {
      const reason = document.createElement('div');
      reason.className = 'rule-reason';
      reason.textContent = rule.details.reason;
      details.appendChild(reason);
    }

    if (rule.details.expected !== undefined || rule.details.actual !== undefined) {
      const comparison = document.createElement('div');
      comparison.className = 'rule-comparison';
      comparison.innerHTML = `
        ${rule.details.expected !== undefined ? `<div><strong>Expected:</strong> ${JSON.stringify(rule.details.expected)}</div>` : ''}
        ${rule.details.actual !== undefined ? `<div><strong>Actual:</strong> ${JSON.stringify(rule.details.actual)}</div>` : ''}
      `;
      details.appendChild(comparison);
    }

    if (rule.details.metadata) {
      const metadata = document.createElement('details');
      metadata.className = 'rule-metadata';
      const metaSummary = document.createElement('summary');
      metaSummary.textContent = 'Additional Metadata';
      metadata.appendChild(metaSummary);

      const metaPre = document.createElement('pre');
      metaPre.textContent = JSON.stringify(rule.details.metadata, null, 2);
      metadata.appendChild(metaPre);

      details.appendChild(metadata);
    }

    ruleDiv.appendChild(details);
  }

  return ruleDiv;
}

// Timeline view
function createValidationTimeline(journey) {
  const timeline = document.createElement('details');
  timeline.className = 'dtl-validation-timeline';

  const summary = document.createElement('summary');
  summary.textContent = 'Validation Timeline';
  timeline.appendChild(summary);

  const timelineContent = document.createElement('div');
  timelineContent.className = 'timeline-content';

  journey.forEach((rule, index) => {
    const item = document.createElement('div');
    item.className = `timeline-item status-${rule.status}`;

    const time = new Date(rule.timestamp).toLocaleTimeString();
    const statusIcon = {
      pass: '✓',
      fail: '✗',
      warn: '⚠',
      skip: '○'
    }[rule.status];

    item.innerHTML = `
      <div class="timeline-marker">${index + 1}</div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-status ${rule.status}">${statusIcon}</span>
          <span class="timeline-rule">${rule.ruleName}</span>
          <span class="timeline-time">${time}</span>
        </div>
        ${rule.status !== 'pass' && rule.details?.reason ? `<div class="timeline-reason">${rule.details.reason}</div>` : ''}
      </div>
    `;

    timelineContent.appendChild(item);
  });

  timeline.appendChild(timelineContent);

  return timeline;
}
```

### List View Enhancements

```javascript
// Add validation badge to event rows
function render() {
  const tbody = document.getElementById("lh-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (trackedItems.length === 0) {
    showLoadingState();
    return;
  }

  for (let i = trackedItems.length - 1; i >= 0; i--) {
    const it = trackedItems[i];

    if (!it || typeof it !== 'object' || !('index' in it) || !('eventName' in it)) {
      console.warn('Skipping malformed item:', it);
      continue;
    }

    const tr = document.createElement("tr");
    tr.className = "dtl-table-row";

    // Add validation score badge if metadata exists
    if (it.validation?.summary) {
      const score = it.validation.summary.score || 100;
      const badgeClass = score === 100 ? 'badge-perfect' : score >= 80 ? 'badge-good' : 'badge-warning';
      tr.classList.add(badgeClass);
    }

    const tdIdx = document.createElement("td");
    tdIdx.textContent = String(it.index ?? 'N/A');
    tdIdx.className = "dtl-table-cell";

    const tdEvent = document.createElement("td");
    tdEvent.className = "dtl-table-cell";

    // Event name with validation badge
    const eventNameSpan = document.createElement('span');
    eventNameSpan.textContent = it.eventName || 'unknown';

    if (it.validation?.summary) {
      const score = it.validation.summary.score || 100;
      const badge = document.createElement('span');
      badge.className = `dtl-validation-badge ${score === 100 ? 'perfect' : score >= 80 ? 'good' : 'warning'}`;
      badge.textContent = `${score}`;
      badge.title = `Validation Score: ${score}% (${it.validation.summary.passedRules}/${it.validation.summary.totalRules} rules passed)`;

      tdEvent.appendChild(eventNameSpan);
      tdEvent.appendChild(badge);
    } else {
      tdEvent.appendChild(eventNameSpan);
    }

    const tdTime = document.createElement("td");
    tdTime.textContent = nowTimeString(it.time);
    tdTime.className = "dtl-table-cell muted";

    tr.appendChild(tdIdx);
    tr.appendChild(tdEvent);
    tr.appendChild(tdTime);

    tr.addEventListener("click", () => {
      showDetailView(it.payload, it.validation);
    });

    tbody.appendChild(tr);
  }

  if (currentView === "list") {
    showListView();
  }
}

// Modified showDetailView to include validation
function showDetailView(item, validation) {
  const listPane = document.getElementById("lh-list");
  const detailPane = document.getElementById("lh-detail");
  const title = document.getElementById("lh-title");
  currentView = "detail";
  selectedItem = item;
  selectedValidation = validation; // NEW: Store validation metadata
  // ... rest of function
}
```

### Filtered Events View

```javascript
// New view for filtered events
function showFilteredEventsView() {
  const listPane = document.getElementById("lh-list");
  const detailPane = document.getElementById("lh-detail");
  const title = document.getElementById("lh-title");

  currentMainView = "filtered";
  listPane.classList.add("dtl-hidden");
  detailPane.classList.add("dtl-visible");
  title.textContent = "Filtered Events";

  // Request filtered events from background
  chrome.runtime.sendMessage(
    { type: 'GET_FILTERED_EVENTS', tabId: currentTabId },
    (response) => {
      renderFilteredEvents(response.filteredEvents, response.stats);
    }
  );
}

function renderFilteredEvents(filteredEvents, stats) {
  const detailPane = document.getElementById("lh-detail");
  if (!detailPane) return;

  detailPane.innerHTML = "";

  // Header with stats
  const header = document.createElement('div');
  header.className = 'dtl-filtered-header';
  header.innerHTML = `
    <h2>Filtered Events</h2>
    <div class="filtered-stats">
      <span>Total Filtered: ${filteredEvents.length}</span>
      ${stats ? `<span>Total Rejected: ${stats.totalRejected}</span>` : ''}
    </div>
  `;
  detailPane.appendChild(header);

  // Rejection reasons summary
  if (stats?.rejectionReasons) {
    const reasonsCard = document.createElement('div');
    reasonsCard.className = 'dtl-rejection-reasons';
    reasonsCard.innerHTML = '<h3>Rejection Reasons</h3>';

    const reasonsList = document.createElement('div');
    reasonsList.className = 'reasons-list';

    stats.rejectionReasons.forEach((count, ruleId) => {
      const item = document.createElement('div');
      item.className = 'reason-item';
      item.innerHTML = `
        <span class="reason-rule">${ruleId}</span>
        <span class="reason-count">${count}</span>
      `;
      reasonsList.appendChild(item);
    });

    reasonsCard.appendChild(reasonsList);
    detailPane.appendChild(reasonsCard);
  }

  // Filtered events list
  const eventsList = document.createElement('div');
  eventsList.className = 'dtl-filtered-events';

  filteredEvents.forEach(event => {
    const eventCard = createFilteredEventCard(event);
    eventsList.appendChild(eventCard);
  });

  detailPane.appendChild(eventsList);
}

function createFilteredEventCard(event) {
  const card = document.createElement('details');
  card.className = 'dtl-filtered-event-card';

  const summary = document.createElement('summary');
  summary.className = 'filtered-event-header';

  const time = new Date(event.capturedAt).toLocaleTimeString();
  summary.innerHTML = `
    <span class="filtered-event-name">${event.eventName || 'unknown'}</span>
    <span class="filtered-event-reason">${event.rejectedBy.ruleName}</span>
    <span class="filtered-event-time">${time}</span>
  `;

  const content = document.createElement('div');
  content.className = 'filtered-event-content';

  // Rejection details
  const rejection = document.createElement('div');
  rejection.className = 'rejection-details';
  rejection.innerHTML = `
    <h4>Rejection Details</h4>
    <div class="rejection-info">
      <div><strong>Rule:</strong> ${event.rejectedBy.ruleId}</div>
      <div><strong>Reason:</strong> ${event.rejectedBy.details?.reason || 'N/A'}</div>
    </div>
  `;
  content.appendChild(rejection);

  // All failures
  if (event.allFailures.length > 1) {
    const allFailures = document.createElement('div');
    allFailures.className = 'all-failures';
    allFailures.innerHTML = `<h4>All Failed Rules (${event.allFailures.length})</h4>`;

    const failuresList = document.createElement('ul');
    event.allFailures.forEach(failure => {
      const li = document.createElement('li');
      li.textContent = `${failure.ruleName}: ${failure.details?.reason || 'N/A'}`;
      failuresList.appendChild(li);
    });

    allFailures.appendChild(failuresList);
    content.appendChild(allFailures);
  }

  // Raw payload
  const payload = document.createElement('details');
  payload.innerHTML = '<summary>Raw Payload</summary>';
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(event.rawPayload, null, 2);
  payload.appendChild(pre);
  content.appendChild(payload);

  card.appendChild(summary);
  card.appendChild(content);

  return card;
}
```

## Related Code Files

**Modified Files**:
- `side_panel.js` (lines 534-754: renderDetail, 480-532: render, 756-813: renderDebugView)
- `side_panel.html` (add "Validation" and "Filtered" menu items)
- `side_panel.css` (new file or styles in side_panel.html)

**New Files**:
- `src/ui/validation-components.js` (optional: extract validation UI logic)

## Implementation Steps

### Step 1: Create CSS Styles
File: Add `<style>` block to `side_panel.html` or create `side_panel.css`
- Validation tab styles
- Badge styles for list view
- Timeline styles
- Filtered events styles
- Color scheme (green=pass, red=fail, yellow=warn)

### Step 2: Implement Validation Tab
File: `side_panel.js`
- Create `createValidationTab()` function
- Create `createValidationSummary()` function
- Create `createCategorySection()` function
- Create `createRuleElement()` function
- Create `createValidationTimeline()` function

### Step 3: Integrate with Detail View
File: `side_panel.js` (lines 534-754)
- Add "Validation" to `tabsSpec` array
- Modify `showDetailView()` to accept validation parameter
- Store `selectedValidation` global variable
- Add case in tab rendering switch

### Step 4: Enhance List View
File: `side_panel.js` (lines 480-532)
- Add validation badge to event name cell
- Add CSS class based on validation score
- Add tooltip with validation summary

### Step 5: Implement Filtered Events View
File: `side_panel.js`
- Create `showFilteredEventsView()` function
- Create `renderFilteredEvents()` function
- Create `createFilteredEventCard()` function
- Add "Filtered Events" menu item
- Add GET_FILTERED_EVENTS message handler

### Step 6: Add Menu Items
File: `side_panel.html`, `side_panel.js` (lines 50-88)
- Add "Filtered Events" dropdown item
- Add "Validation Analytics" dropdown item (future)
- Wire up event handlers

### Step 7: Helper Functions
File: `side_panel.js`
- `formatCategoryName(category)` - Convert enum to readable name
- `calculateValidationScore(summary)` - Compute 0-100 score
- `getRuleDocumentationUrl(ruleId)` - Link to rule docs

## Todo List

- [ ] Design CSS styles for validation components
- [ ] Implement createValidationTab() and sub-components
- [ ] Add "Validation" tab to tabsSpec
- [ ] Modify showDetailView() signature
- [ ] Store selectedValidation global variable
- [ ] Implement validation tab rendering in switch statement
- [ ] Add validation badge to list view render()
- [ ] Implement showFilteredEventsView()
- [ ] Implement renderFilteredEvents()
- [ ] Create filtered event card component
- [ ] Add "Filtered Events" menu item
- [ ] Add dropdown event handler
- [ ] Implement formatCategoryName() helper
- [ ] Test with sample validation metadata
- [ ] Responsive design testing

## Success Criteria

1. **Validation Tab Functional**
   - All rule results displayed
   - Grouped by category
   - Timeline view works
   - Visual indicators clear

2. **List View Enhanced**
   - Validation badges visible
   - Color coding intuitive
   - Tooltips informative

3. **Filtered Events View**
   - Shows all rejected events
   - Rejection reasons clear
   - Allows inspection of raw data

4. **Usability**
   - Navigation intuitive
   - Performance acceptable (<100ms render)
   - No layout shifts

5. **Visual Design**
   - Consistent with existing UI
   - Color scheme accessible
   - Responsive to panel width

## Risk Assessment

### Technical Risks

**Medium Risk**:
- Performance with large metadata objects
  - *Mitigation*: Lazy rendering, virtual scrolling for filtered events

**Low Risk**:
- Layout breaks with long rule names
  - *Mitigation*: Ellipsis, tooltips for full text

### UX Risks

**Medium Risk**:
- Too much information overwhelming users
  - *Mitigation*: Collapsed by default, progressive disclosure

**Low Risk**:
- Color scheme not accessible
  - *Mitigation*: Use icons + colors, test with colorblind simulators

## Security Considerations

1. **XSS Prevention**
   - Sanitize rule names and details before innerHTML
   - *Control*: Use textContent where possible, escape HTML

2. **Data Exposure**
   - Validation metadata might reveal internal logic
   - *Control*: User controls tracking via settings

## Next Steps

1. Design and implement CSS styles
2. Build validation tab components
3. Test with sample metadata from Phase 02
4. Integrate with filtered events from Phase 05
5. Proceed to Phase 05: Filtered events log implementation

## Unresolved Questions

1. Should validation tab be default or hidden initially?
2. Include validation score in event export (CSV/JSON)?
3. Allow users to override rule failures (mark as false positive)?
4. Show validation trends over time (chart)?
