# Phase 01: Foundation & Storage

**Date**: 2026-01-12
**Priority**: Critical
**Status**: In Progress

## Context

Build core settings module with data structure, storage persistence, and default values following src/account.js pattern.

## Key Insights

- Use chrome.storage.local (not sync) for settings
- Follow ES6 module export pattern from src/account.js
- Settings structure supports: environment, API config, logging, filters
- Must provide sensible defaults for all settings

## Requirements

1. Create settings data structure with:
   - Environment config (staging/prod endpoints)
   - API caller settings (auth, headers, timeout)
   - Event logging controls (enabled, save, filters)
   - Advanced options (debug mode)

2. Implement storage functions:
   - loadSettings() - Load with fallback to defaults
   - saveSettings() - Save to chrome.storage.local
   - getDefaultSettings() - Return default config
   - validateSettings() - Validate before save

## Architecture

```
src/settings.js (NEW)
├── getDefaultSettings() → Default config object
├── loadSettings() → Promise<Settings>
├── saveSettings(settings) → Promise<void>
├── validateSettings(settings) → {valid, errors}
└── createSettingsView(settings) → HTMLElement
```

## Implementation Steps

1. Create src/settings.js file
2. Define settings TypeScript-style JSDoc interfaces
3. Implement getDefaultSettings() with full structure
4. Implement loadSettings() with chrome.storage.local
5. Implement saveSettings() with validation
6. Implement validateSettings() with error messages
7. Add createSettingsView() skeleton (UI in later phase)

## Todo List

- [ ] Create src/settings.js
- [ ] Define settings data structure
- [ ] Implement load/save functions
- [ ] Implement validation logic
- [ ] Test storage persistence
- [ ] Export functions as ES6 module

## Success Criteria

- Settings load/save to chrome.storage.local successfully
- Default settings have all required fields
- Validation catches invalid inputs
- Module exports work with ES6 imports

## Related Files

- `src/account.js` - Pattern reference for module structure
- `manifest.json` - Has storage permission (line 18)
- `background.js` - Will consume settings module
- `side_panel.js` - Will consume settings module
