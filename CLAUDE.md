# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LayerHub is a Chrome browser extension for developers that tracks and displays `window.dataLayer` events in a floating panel on the page. It provides real-time inspection and debugging of analytics and tag management implementations.

## Architecture

The extension uses a three-part architecture:

1. **Background Script (`background.js`)** - Listens for extension icon clicks and injects scripts into the active tab
2. **Page Hook (`pagehook.js`)** - Injected into the page's MAIN world context to access `window.dataLayer`, proxies the `push` method, and communicates with content script via custom DOM events
3. **Content Script (`content.js`)** - Runs in isolated context, creates the UI panel using Shadow DOM, and renders dataLayer events

### Key Communication Pattern

The extension communicates between the isolated content script and main page context using custom DOM events:
- `LH_DL_PUSH` - New dataLayer items pushed
- `LH_DL_INITIAL` - Initial dataLayer snapshot
- `LH_DL_REQUEST_INITIAL` - Request for initial data
- `LH_DL_READY` - Hook is ready

### Data Flow

1. Page hook intercepts dataLayer changes via method proxy and polling fallback
2. Sanitizes data (removes functions, symbols, circular references)
3. Emits custom DOM events with sanitized data
4. Content script listens for events and updates UI

## Development Commands

This is a plain JavaScript Chrome extension with no build process:

### Loading Extension for Development
1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the directory containing these files

### Testing
- No automated test framework is configured
- Manual testing by loading the extension and navigating to websites with dataLayer implementations

### Code Quality
- No linting or formatting tools are configured
- Manual code review process

## File Structure

- `manifest.json` - Chrome extension manifest v3 configuration
- `background.js` - Service worker for extension lifecycle and script injection
- `pagehook.js` - Script injected into MAIN world to access dataLayer
- `content.js` - Content script that creates and manages the UI panel
- `popup.js` - Unused popup script (extension uses in-page panel instead)

## Important Implementation Details

### Data Sanitization
The `sanitize()` function in `pagehook.js` creates structured-clone-safe copies of dataLayer objects by:
- Removing functions and symbols
- Handling circular references with WeakSet
- Limiting depth to 6 levels
- Converting BigInt to Number

### UI Features
- Collapsible panel with toggle handle ("DL" button)
- Tabbed detail view (Overview, Page, Location, Tracking, User, etc.)
- Expandable/collapsible JSON sections
- Max 200 items tracked with automatic cleanup
- Shadow DOM to prevent CSS conflicts

### State Management
- LocalStorage for panel collapsed state
- Global variables to prevent multiple initialization
- Event-driven updates between contexts