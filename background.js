// background.js - Service Worker for LayerHub

// Per-tab dataLayer state storage
const tabDataStore = new Map(); // tabId -> { items: [], accountData: null, lastUpdate: timestamp, ready: false, eventCounter: 0 }

// Track which tabs have pagehook injected
const injectedTabs = new Set();

// Current settings
let currentSettings = null;

// Load settings on startup
chrome.runtime.onStartup.addListener(async () => {
     try {
          const result = await chrome.storage.local.get('layerhub_settings');
          if (result.layerhub_settings) {
               currentSettings = result.layerhub_settings;
               console.log('Settings loaded on startup:', currentSettings);
          }
     } catch (error) {
          console.error('Failed to load settings on startup:', error);
     }
});

/**
 * Toggle side panel on extension icon click
 */
chrome.action.onClicked.addListener(async (tab) => {
     if (!tab?.id) return;

     try {
          // Open the side panel first (must happen during user gesture)
          await chrome.sidePanel.open({ windowId: tab.windowId });

          // Then inject pagehook if not already injected (can happen after)
          if (!injectedTabs.has(tab.id)) {
               injectPagehook(tab.id); // Don't await - let it run async
          }
     } catch (e) {
          console.error('Failed to open side panel:', e);
     }
});

/**
 * Inject pagehook.js into the page context
 */
async function injectPagehook(tabId) {
     try {
          await chrome.scripting.executeScript({
               target: { tabId: tabId },
               files: ["pagehook.js"],
               world: "MAIN"
          });
          injectedTabs.add(tabId);
     } catch (e) {
          // Injection may fail on restricted pages (chrome://, edge://, etc.)
          console.log(`Failed to inject pagehook into tab ${tabId}:`, e.message);
     }
}

/**
 * Handle messages from content scripts and side panel
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
     const tabId = sender.tab?.id;

     switch (msg.type) {
          // === Messages from Content Script (relaying from pagehook) ===

          case 'LH_DL_READY':
               // Pagehook is ready
               if (tabId) {
                    initTabData(tabId);
                    // Notify side panel that tab is ready
                    broadcastToSidePanel({ type: 'LH_DL_READY', tabId });
               }
               break;

          case 'LH_DL_INITIAL':
               // Initial dataLayer snapshot
               if (tabId && msg.data?.items) {
                    const tabData = ensureTabData(tabId);

                    // Filter out invalid items and map with sequential indices using the per-tab counter
                    tabData.items = msg.data.items
                         .filter(item => !shouldIgnoreItem(item))
                         .map((item) => {
                              tabData.eventCounter++;
                              return {
                                   index: tabData.eventCounter,
                                   time: Date.now(),
                                   eventName: getEventName(item),
                                   payload: item
                              };
                         });
                    tabData.lastUpdate = Date.now();
                    tabData.ready = true;

                    // Notify side panel
                    broadcastToSidePanel({ type: 'LH_DL_INITIAL', tabId, data: tabData.items });
               }
               break;

          case 'LH_DL_PUSH':
               // New item pushed to dataLayer
               if (tabId && msg.data?.item) {
                    // Filter out invalid items - don't process items that should be ignored
                    if (shouldIgnoreItem(msg.data.item)) {
                         return; // Silently ignore invalid items
                    }

                    const tabData = ensureTabData(tabId);

                    // Increment counter and create new item
                    tabData.eventCounter++;
                    const newItem = {
                         index: tabData.eventCounter,
                         time: Date.now(),
                         eventName: getEventName(msg.data.item),
                         payload: msg.data.item
                    };
                    tabData.items.push(newItem);

                    // Maintain max 200 items
                    if (tabData.items.length > 200) {
                         tabData.items.shift();
                         // Note: We do NOT re-index items - indices are sequential and never reset
                    }

                    tabData.lastUpdate = Date.now();

                    // Notify side panel
                    broadcastToSidePanel({ type: 'LH_DL_PUSH', tabId, data: newItem });
               }
               break;

          case 'LH_DL_ACCOUNT_DATA':
               // Account data received
               if (tabId && msg.data?.accountData) {
                    const tabData = ensureTabData(tabId);
                    tabData.accountData = msg.data.accountData;
                    tabData.lastUpdate = Date.now();

                    // Notify side panel
                    broadcastToSidePanel({ type: 'LH_DL_ACCOUNT_DATA', tabId, data: msg.data.accountData });
               }
               break;

          // === Messages from Side Panel ===

          case 'GET_TAB_DATA':
               // Side panel requesting data for a specific tab
               {
                    const requestedTabId = msg.tabId;
                    const tabData = tabDataStore.get(requestedTabId);

                    if (tabData) {
                         sendResponse({
                              items: tabData.items,
                              accountData: tabData.accountData,
                              ready: tabData.ready,
                              eventCounter: tabData.eventCounter
                         });
                    } else {
                         sendResponse({ items: [], accountData: null, ready: false, eventCounter: 0 });
                    }
               }
               return true; // Keep channel open for async response

          case 'REQUEST_INITIAL':
               // Side panel requesting initial data from page
               {
                    const requestedTabId = msg.tabId;
                    // Forward request to content script
                    chrome.tabs.sendMessage(requestedTabId, { type: 'REQUEST_INITIAL' }).catch(() => {
                         // Content script may not be ready
                    });
               }
               break;

          case 'REQUEST_ACCOUNT':
               // Side panel requesting account data
               {
                    const requestedTabId = msg.tabId;
                    // Forward request to content script
                    chrome.tabs.sendMessage(requestedTabId, { type: 'REQUEST_ACCOUNT' }).catch(() => {
                         // Content script may not be ready
                    });
               }
               break;

          case 'SIDE_PANEL_OPENED':
               // Side panel was opened, check if we need to inject pagehook
               {
                    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                         if (tabs[0]?.id && !injectedTabs.has(tabs[0].id)) {
                              await injectPagehook(tabs[0].id);
                         }
                    });
               }
               break;

          case 'SETTINGS_UPDATED':
               // Settings updated from side panel
               {
                    if (msg.settings) {
                         currentSettings = msg.settings;
                         console.log('Settings updated:', currentSettings);

                         // Apply settings to runtime behavior
                         applySettings(currentSettings);
                    }
               }
               break;
     }
});

/**
 * Apply settings to runtime behavior
 */
function applySettings(settings) {
     if (!settings) return;

     // Log if debug mode is enabled
     if (settings.advanced.debugMode) {
          console.log('Debug mode enabled');
          console.log('Current environment:', settings.environment.current);
          console.log('Event logging enabled:', settings.eventLogging.enabled);
     }

     // Additional runtime behavior changes can be added here
     // For example:
     // - Configure API endpoints based on environment
     // - Apply authentication headers
     // - Update event filtering rules
}

/**
 * Handle tab activation (user switches tabs)
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
     // Notify side panel that active tab changed
     broadcastToSidePanel({ type: 'TAB_SWITCHED', tabId: activeInfo.tabId });
});

/**
 * Handle tab removal (user closes tab)
 */
chrome.tabs.onRemoved.addListener((tabId) => {
     // Clean up stored data for this tab
     tabDataStore.delete(tabId);
     injectedTabs.delete(tabId);
});

/**
 * Handle tab updates (navigation, reload)
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
     if (changeInfo.status === 'loading') {
          // Page is navigating, clear old data
          tabDataStore.delete(tabId);
          injectedTabs.delete(tabId);

          // Notify side panel that tab is navigating
          broadcastToSidePanel({ type: 'TAB_NAVIGATED', tabId });
     }

     if (changeInfo.status === 'complete') {
          // Page load complete, inject pagehook if side panel might be open
          // Only inject on allowed URLs
          if (canInjectOnTab(tab)) {
               // Check if side panel is open for this window
               try {
                    const panel = await chrome.sidePanel.getOptions({ tabId });
                    if (panel.enabled !== false) {
                         await injectPagehook(tabId);
                    }
               } catch (e) {
                    // Side panel API might not be available in all contexts
               }
          }
     }
});

/**
 * Broadcast message to all side panel instances
 */
function broadcastToSidePanel(message) {
     // Send message to runtime (side panel listens on runtime.onMessage)
     chrome.runtime.sendMessage(message).catch(() => {
          // Side panel might not be open, ignore error
     });
}

/**
 * Initialize tab data structure
 */
function initTabData(tabId) {
     if (!tabDataStore.has(tabId)) {
          tabDataStore.set(tabId, {
               items: [],
               accountData: null,
               lastUpdate: Date.now(),
               ready: false,
               eventCounter: 0  // Per-tab event counter
          });
     }
}

/**
 * Ensure tab data exists, create if not
 */
function ensureTabData(tabId) {
     if (!tabDataStore.has(tabId)) {
          initTabData(tabId);
     }
     return tabDataStore.get(tabId);
}

/**
 * Check if an item should be ignored (not a valid event)
 */
function shouldIgnoreItem(item) {
     if (item == null) return true;
     const t = typeof item;
     if (t !== "object") return true;

     // Blacklist of known invalid/placeholder event names
     const INVALID_EVENT_NAMES = [
          'item',           // Generic placeholder
          'gtm.js',         // GTM internal events
          'gtm.dom',
          'gtm.load',
          'gtm.historyChange',
          'gtm.scrollDepth',
          'gtm.linkClick',
          'gtm.formSubmit',
          'gtm.timer',
          'gtm.video',
          'optimize.activate', // Google Optimize
     ];

     // Check if item has a valid event property
     if (typeof item.event === "string" && item.event.trim() !== "") {
          const eventName = item.event.trim().toLowerCase();

          // Filter out blacklisted events
          if (INVALID_EVENT_NAMES.some(invalid => eventName === invalid.toLowerCase())) {
               return true; // Ignore blacklisted events
          }

          return false; // Valid event, don't ignore
     }

     const keys = Object.keys(item);
     if (!keys.length) return true;
     if (keys[0] === "0") return true;
     return false;
}

/**
 * Extract event name from dataLayer item
 */
function getEventName(item) {
     if (!item || typeof item !== "object") return typeof item;
     if (item.event && typeof item.event === "string") return item.event;
     const keys = Object.keys(item);
     return keys.length ? keys[0] : "object";
}

/**
 * Check if we can inject scripts on this tab
 */
function canInjectOnTab(tab) {
     if (!tab.url) return false;
     const restrictedProtocols = ['chrome:', 'edge:', 'about:', 'chrome-extension:', 'edge-extension:'];
     return !restrictedProtocols.some(p => tab.url.startsWith(p));
}
