# Phase 06: Rule Analytics Dashboard

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**:
  - [Phase 01: Rule Metadata Architecture](./phase-01-rule-metadata-architecture.md)
  - [Phase 02: Background Rule Tracking](./phase-02-background-rule-tracking.md)
  - [Phase 05: Filtered Events Log](./phase-05-filtered-events-log.md)
- **Related Docs**: [Extension Workflow](../20260115-extension-workflow-documentation.md)

## Overview

**Date**: 2026-01-15
**Description**: Create analytics dashboard showing rule validation statistics and trends
**Priority**: Medium
**Implementation Status**: Not Started
**Review Status**: Not Reviewed

## Key Insights

### Analytics Use Cases

1. **Event Quality Monitoring**
   - Track validation score trends over time
   - Identify problematic events/pages
   - Monitor improvement after fixes

2. **Rule Performance Analysis**
   - Which rules fail most often
   - Which rules are never triggered
   - Rule execution time distribution

3. **Debugging Aid**
   - Correlate failures with page changes
   - Identify patterns in rejections
   - Spot anomalies in event flow

4. **Compliance Verification**
   - Ensure events meet required schema
   - Track completeness scores
   - Monitor required property presence

## Requirements

### Functional Requirements

1. **Dashboard Views**
   - Overview: High-level statistics
   - Rules: Per-rule performance metrics
   - Timeline: Validation trends over time
   - Heatmap: Rule failures by category
   - Comparison: Before/after analysis

2. **Metrics Tracked**
   - Total events processed
   - Total events rejected
   - Average validation score
   - Pass rate per rule
   - Most common failures
   - Validation score distribution
   - Events per category

3. **Filtering & Segmentation**
   - Filter by date range
   - Filter by event name
   - Filter by rule category
   - Group by tab/domain
   - Compare time periods

4. **Visualizations**
   - Bar charts: Rule pass/fail counts
   - Line charts: Validation score over time
   - Pie charts: Rejection reason distribution
   - Heatmap: Rule failures by category
   - Sparklines: Inline trends

5. **Export & Reporting**
   - Export analytics data as JSON/CSV
   - Generate PDF reports
   - Share analytics via URL
   - Schedule automated reports

### Non-Functional Requirements

1. **Performance**: Render <200ms for 1000 events
2. **Interactivity**: Smooth animations, responsive UI
3. **Accessibility**: WCAG AA compliant

## Architecture

### Analytics Data Structure

```javascript
// Computed analytics from events
interface RuleAnalytics {
  overview: {
    totalProcessed: number;
    totalRejected: number;
    totalAccepted: number;
    avgValidationScore: number;
    dateRange: { start: number; end: number };
  };

  byRule: {
    [ruleId: string]: {
      executed: number;      // Times rule was executed
      passed: number;        // Times rule passed
      failed: number;        // Times rule failed
      warned: number;        // Times rule warned
      skipped: number;       // Times rule skipped
      passRate: number;      // passed / executed
      avgExecutionTime?: number;
    };
  };

  byCategory: {
    [category: string]: {
      totalRules: number;
      executed: number;
      passed: number;
      failed: number;
      passRate: number;
    };
  };

  timeline: {
    interval: 'minute' | 'hour' | 'day';
    dataPoints: Array<{
      timestamp: number;
      avgScore: number;
      totalEvents: number;
      rejectedEvents: number;
    }>;
  };

  topFailures: Array<{
    ruleId: string;
    ruleName: string;
    failureCount: number;
    percentage: number;
    examples: FilteredEvent[];  // Sample failures
  }>;

  scoreDistribution: {
    buckets: Array<{
      range: string;  // "0-20", "20-40", etc.
      count: number;
      percentage: number;
    }>;
  };
}
```

### Analytics Calculator

```javascript
// src/analytics/rule-analytics.js

class RuleAnalyticsCalculator {
  calculateAnalytics(trackedEvents, filteredEvents) {
    const analytics = {
      overview: this.calculateOverview(trackedEvents, filteredEvents),
      byRule: this.calculateByRule(trackedEvents, filteredEvents),
      byCategory: this.calculateByCategory(trackedEvents, filteredEvents),
      timeline: this.calculateTimeline(trackedEvents, filteredEvents),
      topFailures: this.calculateTopFailures(filteredEvents),
      scoreDistribution: this.calculateScoreDistribution(trackedEvents)
    };

    return analytics;
  }

  calculateOverview(tracked, filtered) {
    const total = tracked.length + filtered.length;
    const avgScore = tracked.reduce((sum, e) =>
      sum + (e.validation?.summary?.score || 100), 0) / (tracked.length || 1);

    const timestamps = [
      ...tracked.map(e => e.time),
      ...filtered.map(e => e.capturedAt)
    ];

    return {
      totalProcessed: total,
      totalRejected: filtered.length,
      totalAccepted: tracked.length,
      avgValidationScore: Math.round(avgScore),
      dateRange: {
        start: Math.min(...timestamps),
        end: Math.max(...timestamps)
      }
    };
  }

  calculateByRule(tracked, filtered) {
    const ruleStats = {};

    // Process accepted events
    tracked.forEach(event => {
      if (!event.validation?.journey) return;

      event.validation.journey.forEach(rule => {
        if (!ruleStats[rule.ruleId]) {
          ruleStats[rule.ruleId] = {
            executed: 0,
            passed: 0,
            failed: 0,
            warned: 0,
            skipped: 0
          };
        }

        ruleStats[rule.ruleId].executed++;
        ruleStats[rule.ruleId][rule.status === 'pass' ? 'passed' :
                                rule.status === 'fail' ? 'failed' :
                                rule.status === 'warn' ? 'warned' : 'skipped']++;
      });
    });

    // Process filtered events
    filtered.forEach(event => {
      event.allFailures?.forEach(rule => {
        if (!ruleStats[rule.ruleId]) {
          ruleStats[rule.ruleId] = {
            executed: 0,
            passed: 0,
            failed: 0,
            warned: 0,
            skipped: 0
          };
        }

        ruleStats[rule.ruleId].executed++;
        ruleStats[rule.ruleId].failed++;
      });
    });

    // Calculate pass rates
    Object.keys(ruleStats).forEach(ruleId => {
      const stats = ruleStats[ruleId];
      stats.passRate = stats.executed > 0 ?
        (stats.passed / stats.executed) * 100 : 0;
    });

    return ruleStats;
  }

  calculateByCategory(tracked, filtered) {
    const categoryStats = {};

    const processRules = (rules) => {
      rules.forEach(rule => {
        const cat = rule.category || 'unknown';
        if (!categoryStats[cat]) {
          categoryStats[cat] = {
            totalRules: 0,
            executed: 0,
            passed: 0,
            failed: 0
          };
        }

        categoryStats[cat].executed++;
        if (rule.status === 'pass') categoryStats[cat].passed++;
        if (rule.status === 'fail') categoryStats[cat].failed++;
      });
    };

    tracked.forEach(e => e.validation?.journey && processRules(e.validation.journey));
    filtered.forEach(e => e.allFailures && processRules(e.allFailures));

    Object.keys(categoryStats).forEach(cat => {
      const stats = categoryStats[cat];
      stats.passRate = stats.executed > 0 ?
        (stats.passed / stats.executed) * 100 : 0;
    });

    return categoryStats;
  }

  calculateTimeline(tracked, filtered, interval = 'minute') {
    const allEvents = [
      ...tracked.map(e => ({
        time: e.time,
        score: e.validation?.summary?.score || 100,
        rejected: false
      })),
      ...filtered.map(e => ({
        time: e.capturedAt,
        score: 0,
        rejected: true
      }))
    ].sort((a, b) => a.time - b.time);

    if (allEvents.length === 0) {
      return { interval, dataPoints: [] };
    }

    const intervalMs = {
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000
    }[interval];

    const buckets = new Map();
    const startTime = allEvents[0].time;

    allEvents.forEach(event => {
      const bucketKey = Math.floor((event.time - startTime) / intervalMs);
      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, {
          timestamp: startTime + (bucketKey * intervalMs),
          scores: [],
          totalEvents: 0,
          rejectedEvents: 0
        });
      }

      const bucket = buckets.get(bucketKey);
      bucket.totalEvents++;
      bucket.scores.push(event.score);
      if (event.rejected) bucket.rejectedEvents++;
    });

    const dataPoints = Array.from(buckets.values()).map(bucket => ({
      timestamp: bucket.timestamp,
      avgScore: bucket.scores.reduce((a, b) => a + b, 0) / bucket.scores.length,
      totalEvents: bucket.totalEvents,
      rejectedEvents: bucket.rejectedEvents
    }));

    return { interval, dataPoints };
  }

  calculateTopFailures(filtered) {
    const failureCounts = {};

    filtered.forEach(event => {
      const ruleId = event.rejectedBy.ruleId;
      if (!failureCounts[ruleId]) {
        failureCounts[ruleId] = {
          ruleId,
          ruleName: event.rejectedBy.ruleName,
          failureCount: 0,
          examples: []
        };
      }

      failureCounts[ruleId].failureCount++;
      if (failureCounts[ruleId].examples.length < 3) {
        failureCounts[ruleId].examples.push(event);
      }
    });

    const total = filtered.length;
    const topFailures = Object.values(failureCounts)
      .map(f => ({
        ...f,
        percentage: total > 0 ? (f.failureCount / total) * 100 : 0
      }))
      .sort((a, b) => b.failureCount - a.failureCount);

    return topFailures;
  }

  calculateScoreDistribution(tracked) {
    const buckets = {
      '0-20': 0,
      '20-40': 0,
      '40-60': 0,
      '60-80': 0,
      '80-100': 0
    };

    tracked.forEach(event => {
      const score = event.validation?.summary?.score || 100;
      const bucketKey = score === 100 ? '80-100' :
                        score >= 80 ? '80-100' :
                        score >= 60 ? '60-80' :
                        score >= 40 ? '40-60' :
                        score >= 20 ? '20-40' : '0-20';
      buckets[bucketKey]++;
    });

    const total = tracked.length;
    return {
      buckets: Object.entries(buckets).map(([range, count]) => ({
        range,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
    };
  }
}
```

### Dashboard UI Components

```javascript
// side_panel.js - Analytics view

function showAnalyticsView() {
  const listPane = document.getElementById("lh-list");
  const detailPane = document.getElementById("lh-detail");
  const title = document.getElementById("lh-title");

  currentMainView = "analytics";
  listPane.classList.add("dtl-hidden");
  detailPane.classList.add("dtl-visible");
  title.textContent = "Rule Analytics";

  // Fetch data and compute analytics
  Promise.all([
    new Promise(resolve => {
      chrome.runtime.sendMessage(
        { type: 'GET_TAB_DATA', tabId: currentTabId },
        resolve
      );
    }),
    new Promise(resolve => {
      chrome.runtime.sendMessage(
        { type: 'GET_FILTERED_EVENTS', tabId: currentTabId },
        resolve
      );
    })
  ]).then(([tabData, filteredData]) => {
    const calculator = new RuleAnalyticsCalculator();
    const analytics = calculator.calculateAnalytics(
      tabData.items || [],
      filteredData.filteredEvents || []
    );

    renderAnalyticsDashboard(analytics);
  });
}

function renderAnalyticsDashboard(analytics) {
  const detailPane = document.getElementById("lh-detail");
  if (!detailPane) return;

  detailPane.innerHTML = "";

  // Overview cards
  const overview = createOverviewCards(analytics.overview);
  detailPane.appendChild(overview);

  // Score distribution chart
  const scoreChart = createScoreDistributionChart(analytics.scoreDistribution);
  detailPane.appendChild(scoreChart);

  // Timeline chart
  const timelineChart = createTimelineChart(analytics.timeline);
  detailPane.appendChild(timelineChart);

  // Top failures
  const topFailures = createTopFailuresSection(analytics.topFailures);
  detailPane.appendChild(topFailures);

  // Category breakdown
  const categoryBreakdown = createCategoryBreakdown(analytics.byCategory);
  detailPane.appendChild(categoryBreakdown);

  // Rule details table
  const ruleTable = createRuleDetailsTable(analytics.byRule);
  detailPane.appendChild(ruleTable);
}

function createOverviewCards(overview) {
  const container = document.createElement('div');
  container.className = 'dtl-analytics-overview';

  const cards = [
    {
      label: 'Total Events',
      value: overview.totalProcessed,
      icon: '📊'
    },
    {
      label: 'Accepted',
      value: overview.totalAccepted,
      icon: '✅',
      color: 'green'
    },
    {
      label: 'Rejected',
      value: overview.totalRejected,
      icon: '❌',
      color: 'red'
    },
    {
      label: 'Avg Score',
      value: `${overview.avgValidationScore}%`,
      icon: '🎯',
      color: overview.avgValidationScore >= 80 ? 'green' : 'orange'
    }
  ];

  cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = `dtl-overview-card ${card.color || ''}`;
    cardEl.innerHTML = `
      <div class="card-icon">${card.icon}</div>
      <div class="card-content">
        <div class="card-label">${card.label}</div>
        <div class="card-value">${card.value}</div>
      </div>
    `;
    container.appendChild(cardEl);
  });

  return container;
}

function createScoreDistributionChart(distribution) {
  const section = document.createElement('div');
  section.className = 'dtl-analytics-section';

  section.innerHTML = '<h3>Validation Score Distribution</h3>';

  const chart = document.createElement('div');
  chart.className = 'dtl-bar-chart';

  const maxCount = Math.max(...distribution.buckets.map(b => b.count));

  distribution.buckets.forEach(bucket => {
    const bar = document.createElement('div');
    bar.className = 'bar-item';

    const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;

    bar.innerHTML = `
      <div class="bar-column">
        <div class="bar-fill" style="height: ${height}%"></div>
        <div class="bar-value">${bucket.count}</div>
      </div>
      <div class="bar-label">${bucket.range}</div>
    `;

    chart.appendChild(bar);
  });

  section.appendChild(chart);
  return section;
}

function createTimelineChart(timeline) {
  const section = document.createElement('div');
  section.className = 'dtl-analytics-section';

  section.innerHTML = '<h3>Validation Score Over Time</h3>';

  if (timeline.dataPoints.length === 0) {
    section.innerHTML += '<p>No data available</p>';
    return section;
  }

  const chart = document.createElement('div');
  chart.className = 'dtl-line-chart';

  const maxScore = 100;
  const width = 600;
  const height = 200;

  // SVG line chart
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('class', 'timeline-svg');

  const points = timeline.dataPoints.map((point, i) => {
    const x = (i / (timeline.dataPoints.length - 1)) * width;
    const y = height - ((point.avgScore / maxScore) * height);
    return `${x},${y}`;
  }).join(' ');

  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', '#3b82f6');
  polyline.setAttribute('stroke-width', '2');

  svg.appendChild(polyline);
  chart.appendChild(svg);
  section.appendChild(chart);

  return section;
}

function createTopFailuresSection(topFailures) {
  const section = document.createElement('div');
  section.className = 'dtl-analytics-section';

  section.innerHTML = '<h3>Top Rule Failures</h3>';

  if (topFailures.length === 0) {
    section.innerHTML += '<p>No failures recorded</p>';
    return section;
  }

  const list = document.createElement('div');
  list.className = 'dtl-top-failures';

  topFailures.slice(0, 5).forEach((failure, index) => {
    const item = document.createElement('div');
    item.className = 'failure-item';
    item.innerHTML = `
      <div class="failure-rank">${index + 1}</div>
      <div class="failure-content">
        <div class="failure-name">${failure.ruleName}</div>
        <div class="failure-rule-id">${failure.ruleId}</div>
      </div>
      <div class="failure-stats">
        <div class="failure-count">${failure.failureCount}</div>
        <div class="failure-percentage">${failure.percentage.toFixed(1)}%</div>
      </div>
    `;
    list.appendChild(item);
  });

  section.appendChild(list);
  return section;
}

function createCategoryBreakdown(byCategory) {
  const section = document.createElement('div');
  section.className = 'dtl-analytics-section';

  section.innerHTML = '<h3>Rule Categories</h3>';

  const grid = document.createElement('div');
  grid.className = 'dtl-category-grid';

  Object.entries(byCategory).forEach(([category, stats]) => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <h4>${formatCategoryName(category)}</h4>
      <div class="category-stats">
        <div class="stat-row">
          <span>Executed:</span>
          <span>${stats.executed}</span>
        </div>
        <div class="stat-row">
          <span>Passed:</span>
          <span class="passed">${stats.passed}</span>
        </div>
        <div class="stat-row">
          <span>Failed:</span>
          <span class="failed">${stats.failed}</span>
        </div>
        <div class="stat-row">
          <span>Pass Rate:</span>
          <span class="pass-rate">${stats.passRate.toFixed(1)}%</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function createRuleDetailsTable(byRule) {
  const section = document.createElement('div');
  section.className = 'dtl-analytics-section';

  section.innerHTML = '<h3>Rule Performance</h3>';

  const table = document.createElement('table');
  table.className = 'dtl-rule-table';

  table.innerHTML = `
    <thead>
      <tr>
        <th>Rule ID</th>
        <th>Executed</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Pass Rate</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  Object.entries(byRule)
    .sort(([, a], [, b]) => b.executed - a.executed)
    .forEach(([ruleId, stats]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ruleId}</td>
        <td>${stats.executed}</td>
        <td class="passed">${stats.passed}</td>
        <td class="failed">${stats.failed}</td>
        <td>
          <div class="pass-rate-bar">
            <div class="pass-rate-fill" style="width: ${stats.passRate}%"></div>
            <span>${stats.passRate.toFixed(1)}%</span>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

  section.appendChild(table);
  return section;
}
```

## Related Code Files

**Modified Files**:
- `side_panel.js` (add analytics view)
- `side_panel.html` (add "Analytics" menu item, styles)

**New Files**:
- `src/analytics/rule-analytics.js`

## Implementation Steps

### Step 1: Create Analytics Calculator
- Implement RuleAnalyticsCalculator class
- Methods for each metric calculation
- Optimize for performance

### Step 2: UI Components
- Create analytics view in side panel
- Implement chart components (bar, line, pie)
- Style with CSS

### Step 3: Menu Integration
- Add "Analytics" menu item
- Wire up showAnalyticsView
- Handle view switching

### Step 4: Export Functionality
- Implement JSON export
- Implement CSV export
- Add download triggers

### Step 5: Real-time Updates
- Subscribe to event updates
- Recalculate analytics on new data
- Debounce updates

## Success Criteria

- Analytics computed correctly
- Charts render properly
- Performance <200ms
- Export works
- Insights actionable

## Risk Assessment

**Medium Risk**: Complex calculations slow UI
- *Mitigation*: Web Workers, caching

**Low Risk**: Chart library dependencies
- *Mitigation*: Use native SVG/Canvas

## Security Considerations

- Sanitize data before charts
- Prevent XSS in tooltips

## Next Steps

- Implement calculator
- Build UI components
- Test with real data
- Gather user feedback
