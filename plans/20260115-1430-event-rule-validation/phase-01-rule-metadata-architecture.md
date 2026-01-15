# Phase 01: Rule Metadata Architecture

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: None (foundation phase)
- **Related Docs**: [Extension Workflow](../20260115-extension-workflow-documentation.md)

## Overview

**Date**: 2026-01-15
**Description**: Design comprehensive rule metadata architecture for tracking validation journey of each event
**Priority**: Critical (foundation for all subsequent phases)
**Implementation Status**: Not Started
**Review Status**: Not Reviewed

## Key Insights

### Current Validation Layers (Research Findings)

1. **Sanitization Layer** (pagehook.js)
   - Removes functions, symbols, circular refs
   - Depth limiting (max 6 levels)
   - Type coercion (BigInt → Number)
   - Event property filtering

2. **Blacklist Layer** (background.js - shouldIgnoreItem)
   - Null/undefined check
   - Object type validation
   - Event name validation
   - Blacklist matching (gtm.*, optimize.activate, etc.)
   - Empty key validation

3. **User Filter Layer** (side_panel.js - shouldShowEvent)
   - Event logging enabled check
   - Ignored events list
   - Whitelist (onlyShowEvents)

4. **Schema Validation Layer** (side_panel.js - checkEventStructure)
   - Required properties check
   - Optional properties check
   - Unexpected properties detection
   - Completeness percentage

5. **Item Structure Layer** (side_panel.js)
   - Index property validation
   - EventName property validation
   - Time property validation
   - Payload property validation

### Existing Data Flow

```
Page Event
  ↓ [Sanitization] → metadata needed
  ↓ [Blacklist] → metadata needed
  ↓ [Format]
  ↓ [Storage]
  ↓ [Item Structure] → metadata needed
  ↓ [User Filters] → metadata needed
  ↓ [Display]
```

## Requirements

### Functional Requirements

1. **Rule Metadata Structure**
   - Define schema for rule execution results
   - Support multiple rule types (sanitization, validation, filtering)
   - Include pass/fail status
   - Capture rejection reasons
   - Support nested rule results

2. **Rule Taxonomy**
   - Categorize all validation rules
   - Assign unique IDs to each rule
   - Define rule severity levels
   - Support rule versioning

3. **Metadata Storage**
   - Integrate with existing TrackedItem structure
   - Minimize memory footprint
   - Support serialization for chrome.storage

4. **Backward Compatibility**
   - Existing functionality must not break
   - Optional feature (can be disabled)
   - Graceful degradation if metadata missing

### Non-Functional Requirements

1. **Performance**
   - Metadata tracking adds <5% overhead
   - No blocking operations
   - Efficient data structures

2. **Extensibility**
   - Easy to add new rules
   - Support custom user-defined rules
   - Plugin architecture for rule engines

## Architecture

### Rule Metadata Schema

```javascript
// Rule execution result
interface RuleResult {
  ruleId: string;           // Unique rule identifier
  ruleName: string;         // Human-readable name
  category: RuleCategory;   // Rule type
  status: 'pass' | 'fail' | 'warn' | 'skip';
  timestamp: number;        // When rule executed
  details?: {               // Optional details
    reason?: string;        // Failure/warning reason
    expected?: any;         // Expected value
    actual?: any;           // Actual value
    metadata?: any;         // Rule-specific data
  };
}

// Rule categories
enum RuleCategory {
  SANITIZATION = 'sanitization',
  BLACKLIST = 'blacklist',
  USER_FILTER = 'user_filter',
  SCHEMA_VALIDATION = 'schema_validation',
  STRUCTURE_VALIDATION = 'structure_validation',
  CUSTOM = 'custom'
}

// Rule severity
enum RuleSeverity {
  CRITICAL = 'critical',  // Event rejected if fails
  WARNING = 'warning',    // Event accepted with warning
  INFO = 'info'          // Informational only
}

// Complete rule definition
interface RuleDefinition {
  id: string;
  name: string;
  category: RuleCategory;
  severity: RuleSeverity;
  description: string;
  version: string;
}
```

### Enhanced TrackedItem Structure

```javascript
// Current structure
interface TrackedItem {
  index: number;
  time: number;
  eventName: string;
  payload: object;
}

// Enhanced structure
interface TrackedItemWithRules extends TrackedItem {
  validation: {
    summary: {
      totalRules: number;
      passedRules: number;
      failedRules: number;
      warnings: number;
      score: number;          // 0-100 validation score
    };
    journey: RuleResult[];    // Chronological rule execution
    byCategory: {             // Grouped by category
      [key in RuleCategory]?: RuleResult[];
    };
  };
}
```

### Filtered Event Structure

```javascript
// For events that were rejected
interface FilteredEvent {
  capturedAt: number;
  rawPayload: object;
  eventName?: string;
  rejectedBy: RuleResult;     // Primary rejection reason
  allFailures: RuleResult[];  // All failed rules
  context: {
    tabId: number;
    url: string;
  };
}
```

### Rule Registry

```javascript
// Central registry of all rules
class RuleRegistry {
  private rules: Map<string, RuleDefinition>;

  register(rule: RuleDefinition): void;
  get(ruleId: string): RuleDefinition | undefined;
  getByCategory(category: RuleCategory): RuleDefinition[];
  getAllRules(): RuleDefinition[];
}

// Singleton instance
const ruleRegistry = new RuleRegistry();
```

### Rule Executor Interface

```javascript
// Standard interface for rule execution
interface RuleExecutor {
  execute(
    event: any,
    context?: any
  ): RuleResult;
}

// Example implementation
class BlacklistRuleExecutor implements RuleExecutor {
  constructor(private blacklist: string[]) {}

  execute(event: any): RuleResult {
    const eventName = event?.event?.toLowerCase();
    const isBlacklisted = this.blacklist.some(
      item => eventName === item.toLowerCase()
    );

    return {
      ruleId: 'blacklist.event_name',
      ruleName: 'Event Name Blacklist Check',
      category: RuleCategory.BLACKLIST,
      status: isBlacklisted ? 'fail' : 'pass',
      timestamp: Date.now(),
      details: isBlacklisted ? {
        reason: `Event name '${event.event}' is blacklisted`,
        actual: event.event
      } : undefined
    };
  }
}
```

## Related Code Files

- `background.js` (lines 332-368: shouldIgnoreItem, 85-95: item formatting)
- `pagehook.js` (lines 11-62: sanitize function)
- `side_panel.js` (lines 1063-1080: shouldShowEvent, 989-1061: checkEventStructure)
- `src/settings.js` (lines 187-277: validateSettings)
- `src/utils.js` (lines 15-24: shouldIgnoreItem duplicate)

## Implementation Steps

### Step 1: Create Rule Definition Files

Create `src/rules/` directory structure:
```
src/rules/
  ├── registry.js          // RuleRegistry class
  ├── definitions.js       // All rule definitions
  ├── executors/
  │   ├── sanitization.js
  │   ├── blacklist.js
  │   ├── user-filter.js
  │   ├── schema.js
  │   └── structure.js
  └── types.js            // TypeScript-style JSDoc types
```

### Step 2: Define Rule Taxonomy

In `src/rules/definitions.js`, define all existing rules:
- Sanitization rules (6 rules: type checks, depth, circular refs, event property)
- Blacklist rules (11 rules: one per blacklisted event type + generic checks)
- User filter rules (3 rules: logging enabled, ignore list, whitelist)
- Schema validation rules (based on expectedStructures)
- Structure validation rules (4 rules: index, eventName, time, payload)

### Step 3: Create Rule Executors

Implement executor classes for each validation layer:
- Extract validation logic from existing functions
- Wrap in RuleExecutor interface
- Return structured RuleResult objects

### Step 4: Design Metadata Collection

Create `src/rules/collector.js`:
```javascript
class RuleCollector {
  private results: RuleResult[] = [];

  record(result: RuleResult): void;
  getSummary(): ValidationSummary;
  getJourney(): RuleResult[];
  getByCategory(category: RuleCategory): RuleResult[];
  clear(): void;
}
```

### Step 5: Integration Points

Define integration strategy:
- pagehook.js: Sanitization rule tracking
- background.js: Blacklist rule tracking
- side_panel.js: User filter + schema + structure tracking
- Event flow: Metadata propagates through pipeline

### Step 6: Configuration Schema

Extend settings schema in `src/settings.js`:
```javascript
ruleTracking: {
  enabled: true,
  detailedMetadata: true,     // Include detailed failure reasons
  trackFilteredEvents: true,  // Store rejected events
  maxFilteredEvents: 100,     // Limit filtered event log
  categories: {               // Per-category tracking
    sanitization: true,
    blacklist: true,
    user_filter: true,
    schema_validation: true,
    structure_validation: true
  }
}
```

## Todo List

- [ ] Create src/rules/ directory structure
- [ ] Define RuleResult, RuleDefinition interfaces in types.js
- [ ] Implement RuleRegistry class
- [ ] Document all existing validation rules
- [ ] Create rule definition objects for all 25+ rules
- [ ] Design RuleExecutor interface
- [ ] Create RuleCollector class
- [ ] Extend settings schema with ruleTracking config
- [ ] Design FilteredEvent storage mechanism
- [ ] Write unit tests for rule metadata structures
- [ ] Document API for rule registration

## Success Criteria

1. **Complete Rule Taxonomy**
   - All existing validation rules documented
   - Each rule has unique ID, name, category, severity
   - Rules organized by category

2. **Robust Metadata Schema**
   - RuleResult captures all necessary information
   - TrackedItemWithRules extends current structure non-destructively
   - FilteredEvent structure designed

3. **Extensible Architecture**
   - Easy to add new rules via registry
   - RuleExecutor interface well-defined
   - Plugin pattern supports custom rules

4. **Configuration System**
   - Settings schema extended
   - Tracking can be enabled/disabled
   - Per-category granularity

5. **Documentation Complete**
   - All interfaces documented with JSDoc
   - Integration points clearly defined
   - Migration path from current structure

## Risk Assessment

### Technical Risks

**High Risk**:
- Performance degradation from metadata collection
  - *Mitigation*: Lazy evaluation, toggle to disable
- Memory bloat from storing all rule results
  - *Mitigation*: Configurable detail level, metadata compression

**Medium Risk**:
- Breaking changes to TrackedItem structure
  - *Mitigation*: Additive changes only, backward compatibility
- Complex integration with existing code
  - *Mitigation*: Phased rollout, feature flags

**Low Risk**:
- Rule taxonomy incompleteness
  - *Mitigation*: Iterative refinement, versioning

### Data Risks

- Large metadata objects exceed message size limits
  - *Mitigation*: Compress metadata, paginate results
- Filtered events log consumes too much storage
  - *Mitigation*: Size limits, TTL-based cleanup

## Security Considerations

1. **Data Exposure**
   - Rule metadata might expose internal logic
   - *Control*: User must enable tracking explicitly

2. **Storage Limits**
   - Filtered events stored in chrome.storage.local
   - *Control*: Strict size limits, LRU eviction

3. **Performance DoS**
   - Malicious page could spam events to exhaust tracking
   - *Control*: Rate limiting, max events per tab

4. **Data Sanitization**
   - Ensure rule metadata doesn't contain unsanitized user data
   - *Control*: Sanitize before adding to RuleResult.details

## Next Steps

1. Review and approve architecture design
2. Proceed to Phase 02: Implement background rule tracking
3. Create prototype rule registry with 5 sample rules
4. Performance benchmark metadata overhead

## Unresolved Questions

1. Should rule execution be synchronous or support async rules?
2. How to handle rule versioning across extension updates?
3. Should filtered events persist across browser sessions?
4. What's acceptable memory overhead percentage (current: <5%)?
5. Should rule tracking work in incognito mode?
6. How to handle rule conflicts (e.g., whitelist vs blacklist)?
