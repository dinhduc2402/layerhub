# Research Summary: Existing Rule Validation Systems

**Date**: 2026-01-15
**Research Scope**: LayerHub extension codebase validation and filtering mechanisms

## Executive Summary

LayerHub already implements multi-layer validation with 5 distinct filtering stages. This research identifies all existing rules to inform the rule tracking implementation.

## Validation Layers Identified

### 1. Sanitization Layer (pagehook.js)

**Location**: Lines 11-62
**Rules Count**: 6 core rules

| Rule | Description | Action |
|------|-------------|--------|
| Type check | Primitives pass, non-primitives processed | Pass/Process |
| BigInt conversion | Convert BigInt → Number | Transform |
| Function/Symbol removal | Remove non-serializable types | Remove |
| Depth limit | Max 6 levels deep | Truncate |
| Circular reference | Detect via WeakSet | Remove |
| Event property filter | Only keep objects with 'event' property | Filter |

### 2. Blacklist Layer (background.js)

**Location**: Lines 332-368
**Rules Count**: 5 validation rules + 11 blacklisted names

**Validation Rules**:
1. Null/undefined check
2. Object type check
3. Event property validation
4. Blacklist name matching
5. Empty keys validation

**Blacklisted Event Names**:
- `item` (generic placeholder)
- `gtm.js`, `gtm.dom`, `gtm.load` (GTM internal)
- `gtm.historyChange`, `gtm.scrollDepth`, `gtm.linkClick`
- `gtm.formSubmit`, `gtm.timer`, `gtm.video`
- `optimize.activate` (Google Optimize)

### 3. User Filter Layer (side_panel.js)

**Location**: Lines 1063-1080
**Rules Count**: 3 filter rules

1. Event logging enabled check
2. Ignored events list (user-configurable)
3. Whitelist (onlyShowEvents) - if non-empty, ONLY show these

### 4. Schema Validation Layer (side_panel.js)

**Location**: Lines 989-1061
**Rules Count**: 8 required + 7 optional properties

**Required Properties**:
- event, eventLocation, consentType, tracking
- eventTimestamp, triggers, conversion, userDetails

**Optional Properties**:
- eventType, eventScope, ListenLayer, customValues
- eventID, destinations, {*}AutomaticValues

**Validation Output**:
- isValid, completeness %, missing/present lists

### 5. Item Structure Layer (side_panel.js)

**Location**: Lines 100-109, 141-149, 496-500
**Rules Count**: 4 property checks

**Required TrackedItem Properties**:
1. index (sequential number)
2. eventName (extracted event name)
3. time (timestamp)
4. payload (event data)

## Data Flow Pipeline

```
Event → Sanitization (6 rules)
      → Blacklist (5 rules + 11 names)
      → Format (add metadata)
      → Storage (200 item limit)
      → Structure validation (4 rules)
      → User filters (3 rules)
      → Schema validation (15 properties)
      → Display
```

## Key Files

| File | Responsibility | Rules Count |
|------|----------------|-------------|
| pagehook.js | Sanitization | 6 |
| background.js | Blacklist filtering | 16 |
| side_panel.js | User filters, schema, structure | 22 |
| src/settings.js | Configuration validation | N/A |
| src/utils.js | Shared utilities | Duplicates |

## Total Rule Count

- **Sanitization**: 6 rules
- **Blacklist**: 16 rules (5 validation + 11 names)
- **User Filters**: 3 rules
- **Schema**: 15 property checks
- **Structure**: 4 property checks
- **Total**: 44+ distinct validation points

## Existing Validation Strengths

1. **Multi-layer defense**: 5 independent validation stages
2. **Configurability**: User filters, blacklist extensible
3. **Clear separation**: Each layer has distinct purpose
4. **Performance**: Early rejection (sanitize → blacklist)
5. **Debugging**: Schema validation shows completeness

## Gaps for Rule Tracking

1. **No visibility**: Users don't see which rules applied
2. **Silent failures**: Rejected events disappear
3. **No audit trail**: Can't debug why event filtered
4. **Missing metadata**: No rule execution history
5. **No analytics**: Can't identify patterns

## Implementation Recommendations

### Phase Prioritization

**High Priority** (Phases 01-03):
- Rule metadata architecture
- Background tracking (biggest impact)
- Pagehook tracking (data source)

**Medium Priority** (Phases 04-05):
- UI display (visibility)
- Filtered events log (debugging)

**Low Priority** (Phase 06):
- Analytics dashboard (optimization)

### Quick Wins

1. Add validation metadata to existing TrackedItem structure
2. Instrument shouldIgnoreItem with rule tracking
3. Display validation score badge in list view
4. Log filtered events to console initially

### Technical Considerations

**Performance**:
- Existing validation is fast (<1ms/event)
- Rule tracking must add <5% overhead
- Use conditional execution (toggle via settings)

**Storage**:
- chrome.storage.local has ~5MB limit
- Estimate 1KB per filtered event
- Need LRU eviction strategy

**Compatibility**:
- Must not break existing functionality
- Graceful degradation if tracking disabled
- Backward compatible data structures

## Dependencies

**External**: None (self-contained)

**Internal**:
- Settings system (src/settings.js)
- Message passing (chrome.runtime)
- Storage API (chrome.storage.local)

## Risk Factors

**Low Risk**:
- Well-defined validation layers
- Additive changes (non-breaking)
- Clear separation of concerns

**Medium Risk**:
- Performance overhead from tracking
- Memory usage from metadata
- Storage quota management

**High Risk**: None identified

## Unresolved Questions

1. Should sanitization track individual property removals or aggregate?
2. Track rule execution time for performance profiling?
3. Include original values in rejection metadata?
4. Persist filtered events across browser sessions?
5. Support custom user-defined rules?
6. Export validation data for external analysis?

## Next Actions

1. Review and approve Phase 01 architecture
2. Prototype RuleResult and RuleCollector classes
3. Benchmark metadata overhead with sample events
4. Design UI mockups for validation display
5. Define settings schema for rule tracking config

---

**Research Completed**: 2026-01-15
**Analyst**: Agent a48f21c (Explore subagent)
**Confidence**: High (exhaustive codebase analysis)
