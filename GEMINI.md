# Project Overview

This is a Chrome browser extension designed for developers. Its purpose is to track and display `window.dataLayer` events directly on the page in a convenient, floating panel. This allows for real-time inspection and debugging of analytics and tag management implementations.

## How it Works

The extension has three main parts:

1.  **Background Script (`background.js`):** Listens for the extension's icon click to inject the necessary scripts into the active web page.
2.  **Page Hook (`pagehook.js`):** This script is injected directly into the page's main execution context. It gains access to the `window.dataLayer` array, proxies its `push` method, and uses a polling fallback to capture all data events. It communicates with the content script via custom DOM events (`LH_DL_PUSH`, `LH_DL_INITIAL`).
3.  **Content Script (`content.js`):** This script runs in an isolated world. It creates the UI for the floating panel (using a Shadow DOM to avoid style conflicts) and listens for the custom DOM events dispatched by the page hook. It then renders the dataLayer events in a user-friendly list and detail view.

The `popup.html` and `popup.js` files appear to be unused in the primary workflow, which favors the in-page panel over a browser action popup.

# Building and Running

This is a standard Chrome extension and does not require a build process.

## To run the extension in a development environment:

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" using the toggle in the top-right corner.
3.  Click the "Load unpacked" button.
4.  Select the directory containing these files (`D:\WORK\Datalayer\extension\layerhub`).

The extension will be installed and ready to use. Navigate to any website, and click the extension's icon in the toolbar to activate the on-page dataLayer tracker.

# Development Conventions

*   **No Dependencies:** The project is written in plain JavaScript and has no external dependencies (like npm packages).
*   **Communication:** Communication between the isolated content script and the main page context is handled via custom DOM events (`CustomEvent`). This is a key architectural pattern in the extension.
*   **UI:** The UI is created dynamically using JavaScript and encapsulated in a Shadow DOM to prevent CSS conflicts with the host page.
*   **Code Style:** The code is written in a functional style with clear, single-purpose functions.
