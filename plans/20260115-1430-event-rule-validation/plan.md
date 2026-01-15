# Event Rule Validation and Tracking System

**Plan ID**: 20260115-1430-event-rule-validation
**Created**: 2026-01-15
**Status**: Planning
**Priority**: High

## Overview

Implement comprehensive rule validation tracking system to show which validation rules each dataLayer event has passed/failed. Enhances debugging by exposing internal filtering logic to users.

## Problem Statement

Current LayerHub has multi-layer validation (sanitization, blacklist filtering, user filters, schema validation) but operates as black box. Users cannot see:
- Which rules applied to specific events
- Why events were filtered out
- Validation journey each event took
- Rule satisfaction metrics

## Solution Approach

Add rule tracking metadata to each event, display validation journey in UI, provide audit trail of filtering decisions.

## Implementation Phases

### Phase 01: Rule Metadata Architecture
**File**: [phase-01-rule-metadata-architecture.md](./phase-01-rule-metadata-architecture.md)
**Status**: Not Started | **Progress**: 0%
**Description**: Design data structures for rule tracking, define rule taxonomy

### Phase 02: Background Rule Tracking
**File**: [phase-02-background-rule-tracking.md](./phase-02-background-rule-tracking.md)
**Status**: Not Started | **Progress**: 0%
**Description**: Implement rule tracking in background.js validation layers

### Phase 03: Pagehook Sanitization Tracking
**File**: [phase-03-pagehook-sanitization-tracking.md](./phase-03-pagehook-sanitization-tracking.md)
**Status**: Not Started | **Progress**: 0%
**Description**: Add sanitization rule tracking to pagehook.js

### Phase 04: UI Rule Display
**File**: [phase-04-ui-rule-display.md](./phase-04-ui-rule-display.md)
**Status**: Not Started | **Progress**: 0%
**Description**: Create UI components to display rule validation results

### Phase 05: Filtered Events Log
**File**: [phase-05-filtered-events-log.md](./phase-05-filtered-events-log.md)
**Status**: Not Started | **Progress**: 0%
**Description**: Implement separate log for filtered/rejected events with reasons

### Phase 06: Rule Analytics Dashboard
**File**: [phase-06-rule-analytics-dashboard.md](./phase-06-rule-analytics-dashboard.md)
**Status**: Not Started | **Progress**: 0%
**Description**: Add analytics view showing rule application statistics

## Key Deliverables

1. Rule metadata schema integrated into TrackedItem structure
2. Rule tracking in all validation layers (sanitization, blacklist, user filters, schema)
3. UI components displaying validation journey per event
4. Filtered events log showing rejected events with rejection reasons
5. Analytics dashboard with rule satisfaction metrics

## Success Metrics

- All validation layers track and report rules applied
- Users can see full validation journey for each event
- Filtered events are logged with clear rejection reasons
- Zero performance degradation from rule tracking (<5% overhead)

## Dependencies

- Existing codebase structure (background.js, pagehook.js, side_panel.js)
- Settings system (src/settings.js)
- Current validation functions (shouldIgnoreItem, shouldShowEvent, checkEventStructure)

## Timeline Estimate

- Phase 01-03: Core tracking infrastructure (2-3 days)
- Phase 04-06: UI and analytics (2-3 days)
- Total: 4-6 days

## Risk Assessment

**Low Risk**:
- Well-defined existing validation layers
- Non-breaking additive changes
- Clear separation of concerns

**Medium Risk**:
- Performance impact from metadata tracking
- Increased memory usage from storing rejected events

**Mitigation**:
- Implement efficient metadata structure
- Add toggle to disable detailed tracking
- Limit filtered events log size
