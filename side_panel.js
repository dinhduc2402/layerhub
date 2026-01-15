// side_panel.js - UI logic for the side panel

// Import modules
import { createAccountDetailView } from './src/account.js';
import { loadSettings, saveSettings, getDefaultSettings, createSettingsView, extractSettingsFromUI } from './src/settings.js';

// Constants
const MAX_ITEMS = 200;

// State management
let currentTabId = null;
const trackedItems = [];
let selectedItem = null;
let detailActiveTab = "Raw";
let currentView = "list"; // "list" or "detail"
let detailViewMode = "eventDetail"; // "eventDetail" or "debug"
let currentMainView = "events"; // "events" or "account" or "settings"
let accountDetailViewElement = null;
let currentSettings = null;

// Initialize the side panel
async function init() {
     // Notify background that side panel is open
     chrome.runtime.sendMessage({ type: 'SIDE_PANEL_OPENED' }).catch(() => { });

     // Load settings
     currentSettings = await loadSettings();

     // Get current active tab
     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
     if (tab?.id) {
          currentTabId = tab.id;
          await requestTabData(currentTabId);
     }

     // Setup event listeners
     setupEventListeners();

     // Listen for messages from background
     chrome.runtime.onMessage.addListener(handleBackgroundMessage);

     // Listen for tab activations
     chrome.tabs.onActivated.addListener(handleTabSwitch);

     // Apply environment badge if needed
     updateEnvironmentBadge();
}

// Setup UI event listeners
function setupEventListeners() {
     // Dropdown menu
     const dropdownIcon = document.getElementById('menu-icon');
     const dropdownMenu = document.getElementById('dropdown-menu');
     const dropdownContainer = document.querySelector('.dtl-dropdown-container');

     if (dropdownIcon && dropdownMenu && dropdownContainer) {
          dropdownIcon.addEventListener('mouseenter', () => {
               dropdownMenu.style.display = 'block';
               dropdownIcon.style.backgroundColor = 'rgba(255,255,255,0.2)';
          });

          dropdownContainer.addEventListener('mouseleave', () => {
               dropdownMenu.style.display = 'none';
               dropdownIcon.style.backgroundColor = 'transparent';
          });

          // Dropdown menu items
          const menuItems = dropdownMenu.querySelectorAll('.dtl-dropdown-item');
          menuItems.forEach(item => {
               item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f0f9ff';
               });
               item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'transparent';
               });
               item.addEventListener('click', () => {
                    const view = item.dataset.view;
                    if (view === 'account') {
                         showAccountView();
                    } else if (view === 'events') {
                         showEventsView();
                    } else if (view === 'settings') {
                         showSettingsView();
                    }
                    dropdownMenu.style.display = 'none';
               });
          });
     }
}

// Request tab data from background
async function requestTabData(tabId) {
     return new Promise((resolve) => {
          chrome.runtime.sendMessage(
               { type: 'GET_TAB_DATA', tabId },
               (response) => {
                    if (response && response.items) {
                         trackedItems.length = 0;

                         // Filter out malformed items before adding to trackedItems
                         const validItems = response.items.filter(item => {
                              const isValid = item && typeof item === 'object' &&
                                             'index' in item && 'eventName' in item &&
                                             'time' in item && 'payload' in item;
                              if (!isValid) {
                                   console.warn('Filtering out malformed item from initial load:', item);
                              }
                              return isValid;
                         });

                         trackedItems.push(...validItems);

                         if (response.accountData) {
                              buildAccountView(response.accountData);
                         }
                         render();
                    } else if (!response || !response.ready) {
                         // No data yet, request initial load
                         chrome.runtime.sendMessage({ type: 'REQUEST_INITIAL', tabId }).catch(() => { });
                         showLoadingState();
                    }
                    resolve();
               }
          );
     });
}

// Handle messages from background service worker
function handleBackgroundMessage(msg) {
     // Only process messages for current tab (global panel shows active tab)
     if (msg.tabId && msg.tabId !== currentTabId) {
          return;
     }

     switch (msg.type) {
          case 'LH_DL_INITIAL':
               if (msg.data) {
                    trackedItems.length = 0;

                    // Filter out malformed items before adding to trackedItems
                    const validItems = msg.data.filter(item => {
                         const isValid = item && typeof item === 'object' &&
                                        'index' in item && 'eventName' in item &&
                                        'time' in item && 'payload' in item;
                         if (!isValid) {
                              console.warn('Filtering out malformed item from LH_DL_INITIAL:', item);
                         }
                         return isValid;
                    });

                    trackedItems.push(...validItems);
                    render();
               }
               break;

          case 'LH_DL_PUSH':
               if (msg.data) {
                    pushTracked(msg.data);
               }
               break;

          case 'LH_DL_ACCOUNT_DATA':
               if (msg.data) {
                    buildAccountView(msg.data);
               }
               break;

          case 'TAB_SWITCHED':
               handleTabSwitch();
               break;

          case 'TAB_NAVIGATED':
               // Tab navigated, clear data
               trackedItems.length = 0;
               showLoadingState();
               break;
     }
}

// Handle tab switch
async function handleTabSwitch() {
     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
     if (tab && tab.id !== currentTabId) {
          currentTabId = tab.id;

          // Clear current view
          trackedItems.length = 0;
          selectedItem = null;
          currentView = "list";
          showListView();

          // Check if tab is a restricted page
          if (!canViewTab(tab)) {
               showRestrictedPageMessage();
               return;
          }

          // Request data for new tab
          await requestTabData(currentTabId);
     }
}

// Check if we can view this tab
function canViewTab(tab) {
     if (!tab.url) return false;
     const restrictedProtocols = ['chrome:', 'edge:', 'about:', 'chrome-extension:', 'edge-extension:'];
     return !restrictedProtocols.some(p => tab.url.startsWith(p));
}

// Show loading state
function showLoadingState() {
     const tbody = document.getElementById('lh-tbody');
     if (tbody) {
          tbody.innerHTML = `
               <tr>
                    <td colspan="3" style="text-align: center; padding: 40px; color: #6b7280;">
                         <div style="font-size: 32px; margin-bottom: 12px;">⏳</div>
                         <div>Waiting for dataLayer...</div>
                         <div style="font-size: 12px; margin-top: 8px;">Navigate to a page with dataLayer implementation</div>
                    </td>
               </tr>
          `;
     }
}

// Show restricted page message
function showRestrictedPageMessage() {
     const tbody = document.getElementById('lh-tbody');
     if (tbody) {
          tbody.innerHTML = `
               <tr>
                    <td colspan="3" style="text-align: center; padding: 40px; color: #dc2626;">
                         <div style="font-size: 32px; margin-bottom: 12px;">🚫</div>
                         <div>Extension cannot run on this page</div>
                         <div style="font-size: 12px; margin-top: 8px; color: #6b7280;">Browser internal pages are restricted</div>
                    </td>
               </tr>
          `;
     }
}

// Helper functions
function nowTimeString(ts) {
     if (!ts || isNaN(ts)) return 'Invalid Date';
     const d = new Date(ts);
     if (isNaN(d.getTime())) return 'Invalid Date';
     return d.toLocaleTimeString();
}


function formatJsonWithSyntax(obj) {
     const json = JSON.stringify(obj, null, 2);
     return json
          .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
               let cls = 'text-gray-300';
               if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                         cls = 'text-purple-400 font-semibold'; // property keys
                    } else {
                         cls = 'text-green-400'; // string values
                    }
               } else if (/true|false/.test(match)) {
                    cls = 'text-blue-400'; // boolean
               } else if (/null/.test(match)) {
                    cls = 'text-gray-500 italic'; // null
               } else {
                    cls = 'text-orange-400'; // numbers
               }
               return '<span class="' + cls + '">' + match + '</span>';
          })
          .replace(/([\[\]{},])/g, '<span class="text-gray-500">$1</span>');
}

// View management
function showListView() {
     const listPane = document.getElementById("lh-list");
     const detailPane = document.getElementById("lh-detail");
     const title = document.getElementById("lh-title");
     currentView = "list";
     currentMainView = "events";
     listPane.classList.add("dtl-visible");
     listPane.classList.remove("dtl-hidden");
     detailPane.classList.add("dtl-hidden");
     detailPane.classList.remove("dtl-visible");
     title.textContent = "LayerHub Datalayer";
}

function showDetailView(item) {
     const listPane = document.getElementById("lh-list");
     const detailPane = document.getElementById("lh-detail");
     const title = document.getElementById("lh-title");
     currentView = "detail";
     selectedItem = item;
     listPane.classList.add("dtl-hidden");
     listPane.classList.remove("dtl-visible");
     detailPane.classList.add("dtl-visible");
     detailPane.classList.remove("dtl-hidden");
     const eventName = item?.event || 'unknown';
     title.textContent = eventName;
     detailViewMode = "eventDetail";
     renderDetail();
}

function showAccountView() {
     const listPane = document.getElementById("lh-list");
     const detailPane = document.getElementById("lh-detail");
     const title = document.getElementById("lh-title");
     currentMainView = "account";
     listPane.classList.add("dtl-hidden");
     listPane.classList.remove("dtl-visible");
     detailPane.classList.add("dtl-visible");
     detailPane.classList.remove("dtl-hidden");
     title.textContent = "Account Details";

     // Request account data if we don't have it
     if (!accountDetailViewElement) {
          chrome.runtime.sendMessage({ type: 'REQUEST_ACCOUNT', tabId: currentTabId }).catch(() => { });

          // Show loading message
          detailPane.innerHTML = "";
          const loadingMsg = document.createElement("div");
          loadingMsg.style.cssText = "text-align: center; padding: 40px; color: #6b7280; font-size: 16px;";
          loadingMsg.innerHTML = `
               <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
               <div style="font-weight: 600; margin-bottom: 8px;">Loading Account Data...</div>
               <div style="font-size: 14px;">Please wait while we retrieve your account information.</div>
          `;
          detailPane.appendChild(loadingMsg);
     } else {
          detailPane.innerHTML = "";
          detailPane.appendChild(accountDetailViewElement);
     }
}

function showEventsView() {
     currentMainView = "events";
     showListView();
}

function showSettingsView() {
     const listPane = document.getElementById("lh-list");
     const detailPane = document.getElementById("lh-detail");
     const title = document.getElementById("lh-title");

     currentMainView = "settings";
     listPane.classList.add("dtl-hidden");
     listPane.classList.remove("dtl-visible");
     detailPane.classList.add("dtl-visible");
     detailPane.classList.remove("dtl-hidden");
     title.textContent = "Settings";

     // Render settings UI
     renderSettingsView();
}

function renderSettingsView() {
     const detailPane = document.getElementById("lh-detail");
     if (!detailPane) return;

     detailPane.innerHTML = "";

     // Create settings view with current settings
     const settingsElement = createSettingsView(
          currentSettings,
          handleSaveSettings,
          handleResetSettings
     );

     detailPane.appendChild(settingsElement);
}

async function handleSaveSettings() {
     const detailPane = document.getElementById("lh-detail");
     const settingsContainer = detailPane.querySelector('.dtl-settings-container');

     if (!settingsContainer) return;

     try {
          // Extract settings from UI
          const newSettings = extractSettingsFromUI(settingsContainer);

          // Save settings
          await saveSettings(newSettings);

          // Update current settings
          currentSettings = newSettings;

          // Update environment badge
          updateEnvironmentBadge();

          // Show success message
          showNotification('Settings saved successfully!', 'success');

          // Reload data to apply filters
          render();
     } catch (error) {
          showNotification('Failed to save settings: ' + error.message, 'error');
     }
}

async function handleResetSettings() {
     if (confirm('Reset all settings to defaults?')) {
          try {
               // Get default settings
               const defaultSettings = getDefaultSettings();

               // Save defaults
               await saveSettings(defaultSettings);

               // Update current settings
               currentSettings = defaultSettings;

               // Re-render settings view
               renderSettingsView();

               // Update environment badge
               updateEnvironmentBadge();

               // Show success message
               showNotification('Settings reset to defaults', 'success');
          } catch (error) {
               showNotification('Failed to reset settings: ' + error.message, 'error');
          }
     }
}

function updateEnvironmentBadge() {
     if (!currentSettings) return;

     const titleContainer = document.getElementById("lh-title");
     if (!titleContainer) return;

     // Remove existing badge
     const existingBadge = document.querySelector('.dtl-env-badge');
     if (existingBadge) existingBadge.remove();

     // Only show badge for non-production environments
     if (currentSettings.environment.current !== 'prod') {
          const badge = document.createElement('span');
          badge.className = 'dtl-env-badge dtl-env-badge-staging';
          badge.textContent = currentSettings.environment.current.toUpperCase();
          titleContainer.parentNode.insertBefore(badge, titleContainer.nextSibling);
     }
}

function showNotification(message, type = 'info') {
     // Create notification element
     const notification = document.createElement('div');
     notification.className = `dtl-notification dtl-notification-${type}`;
     notification.textContent = message;

     // Append to body
     const root = document.getElementById('lh-root');
     if (root) {
          root.appendChild(notification);

          // Auto-remove after 3 seconds
          setTimeout(() => {
               notification.classList.add('dtl-fade-out');
               setTimeout(() => notification.remove(), 300);
          }, 3000);
     }
}

function buildAccountView(data) {
     accountDetailViewElement = createAccountDetailView(data);

     // If account view is currently visible, update it immediately
     if (currentMainView === "account") {
          const detailPane = document.getElementById("lh-detail");
          if (detailPane) {
               detailPane.innerHTML = "";
               if (accountDetailViewElement) {
                    detailPane.appendChild(accountDetailViewElement);
               }
          }
     }
}

// Rendering functions
function render() {
     const tbody = document.getElementById("lh-tbody");
     if (!tbody) return;

     tbody.innerHTML = "";

     if (trackedItems.length === 0) {
          showLoadingState();
          return;
     }

     // Render items in reverse order (newest first)
     for (let i = trackedItems.length - 1; i >= 0; i--) {
          const it = trackedItems[i];

          // Skip malformed items (missing required properties)
          if (!it || typeof it !== 'object' || !('index' in it) || !('eventName' in it)) {
               console.warn('Skipping malformed item:', it);
               continue;
          }

          const tr = document.createElement("tr");
          tr.className = "dtl-table-row";

          const tdIdx = document.createElement("td");
          tdIdx.textContent = String(it.index ?? 'N/A');
          tdIdx.className = "dtl-table-cell";

          const tdEvent = document.createElement("td");
          tdEvent.textContent = it.eventName || 'unknown';
          tdEvent.className = "dtl-table-cell";

          const tdTime = document.createElement("td");
          tdTime.textContent = nowTimeString(it.time);
          tdTime.className = "dtl-table-cell muted";

          tr.appendChild(tdIdx);
          tr.appendChild(tdEvent);
          tr.appendChild(tdTime);

          tr.addEventListener("click", () => {
               showDetailView(it.payload);
          });

          tbody.appendChild(tr);
     }

     // Show list view if currently in list mode
     if (currentView === "list") {
          showListView();
     }
}

function renderDetail() {
     const pane = document.getElementById("lh-detail");
     if (!pane) return;

     pane.innerHTML = "";
     if (!selectedItem) return;

     const s = selectedItem;

     // Navigation bar with Back button and mode tabs
     const navBar = document.createElement("div");
     navBar.className = "dtl-nav-bar";

     // Back button
     const backButton = document.createElement("button");
     backButton.textContent = "← Back";
     backButton.className = "dtl-button";
     backButton.addEventListener("click", () => {
          showListView();
     });

     // Event Detail button
     const eventDetailBtn = document.createElement("button");
     eventDetailBtn.textContent = "Event Detail";
     eventDetailBtn.className = "dtl-button";
     if (detailViewMode === "eventDetail") {
          eventDetailBtn.classList.add("dtl-button-primary");
     }
     eventDetailBtn.addEventListener("click", () => {
          detailViewMode = "eventDetail";
          renderDetail();
     });

     // Debug button
     const debugBtn = document.createElement("button");
     debugBtn.textContent = "Debug";
     debugBtn.className = "dtl-button";
     if (detailViewMode === "debug") {
          debugBtn.classList.add("dtl-button-primary");
     }
     debugBtn.addEventListener("click", () => {
          detailViewMode = "debug";
          renderDetail();
     });

     navBar.appendChild(backButton);
     navBar.appendChild(eventDetailBtn);
     navBar.appendChild(debugBtn);

     pane.appendChild(navBar);

     // Find any property ending with "AutomaticValues"
     const automaticValuesKey = Object.keys(s || {}).find(k => k.endsWith('AutomaticValues'));
     const tabsSpec = [
          { key: "Automatic Values", available: !!automaticValuesKey },
          { key: "Location", available: !!s?.eventLocation },
          { key: "Tracking", available: !!(s?.tracking || s?.consentType) },
          { key: "User", available: !!s?.userDetails },
          { key: "Time", available: !!s?.eventTimestamp },
          { key: "Triggers", available: !!(s?.triggers || s?.trigger) },
          { key: "Conversion", available: !!s?.conversion },
          { key: "Destinations", available: !!s?.destinations },
          { key: "Custom", available: !!s?.customValues },
          { key: "Raw", available: true },
          { key: "All", available: true }
     ].filter(t => t.available);

     if (!tabsSpec.some(t => t.key === detailActiveTab)) {
          detailActiveTab = tabsSpec[0]?.key || "Raw";
     }

     // Render based on view mode
     if (detailViewMode === "debug") {
          renderDebugView(pane, s);
          return;
     }

     // Event Detail mode
     const layoutContainer = document.createElement("div");
     layoutContainer.className = "dtl-layout";

     // Fixed side menu
     const sideMenu = document.createElement("div");
     sideMenu.className = "dtl-side-menu";

     const tabToMenuMap = {
          "Automatic Values": { label: "Auto" },
          "Location": { label: "Location" },
          "Tracking": { label: "Tracking" },
          "User": { label: "User" },
          "Time": { label: "Time" },
          "Triggers": { label: "Trigger" },
          "Conversion": { label: "Conversion" },
          "Destinations": { label: "Destinations" },
          "Custom": { label: "Custom" },
          "Raw": { label: "Raw" },
          "All": { label: "All" }
     };

     tabsSpec.forEach(t => {
          const menuInfo = tabToMenuMap[t.key] || { label: t.key.substring(0, 6) };

          const menuItem = document.createElement("div");
          menuItem.className = "dtl-menu-item";
          if (t.key === detailActiveTab) {
               menuItem.classList.add("active");
          }

          const labelDiv = document.createElement("div");
          labelDiv.className = "dtl-menu-label";
          labelDiv.textContent = menuInfo.label;

          menuItem.appendChild(labelDiv);
          menuItem.setAttribute("title", t.key);

          menuItem.addEventListener("click", () => {
               detailActiveTab = t.key;
               renderDetail();
          });

          sideMenu.appendChild(menuItem);
     });

     // Tab content area
     const tabContent = document.createElement("div");
     tabContent.className = "dtl-tab-content";

     layoutContainer.appendChild(sideMenu);
     layoutContainer.appendChild(tabContent);
     pane.appendChild(layoutContainer);

     function section(label, content) {
          if (content == null) return;
          const det = document.createElement("details");
          det.open = true;
          const sum = document.createElement("summary");
          sum.textContent = label;
          const inner = document.createElement("div");
          inner.className = "kv";

          if (typeof content === "object") {
               const pre = document.createElement("pre");
               try {
                    pre.textContent = JSON.stringify(content, null, 2);
               } catch (_) {
                    pre.textContent = String(content);
               }
               pre.style.gridColumn = "1 / -1";
               pre.style.width = "100%";
               inner.appendChild(pre);
          } else {
               const pre = document.createElement("pre");
               pre.textContent = String(content);
               pre.style.gridColumn = "1 / -1";
               pre.style.width = "100%";
               inner.appendChild(pre);
          }

          det.appendChild(sum);
          det.appendChild(inner);
          tabContent.appendChild(det);
     }

     const renderAll = () => {
          const automaticValuesKey = Object.keys(s || {}).find(k => k.endsWith('AutomaticValues'));
          section("Automatic Values", automaticValuesKey ? s[automaticValuesKey] : null);
          section("Event Location", s.eventLocation);
          section("Tracking", s.tracking);
          section("Consent Type", s.consentType);
          section("User Details", s.userDetails);
          section("Event Timestamp", s.eventTimestamp);
          section("ListenLayer", s.ListenLayer);
          section("Triggers", s.triggers || s.trigger);
          section("Conversion", s.conversion);
          section("Destinations", s.destinations);
          section("Custom Values", s.customValues);
     };

     switch (detailActiveTab) {
          case "Automatic Values":
               const automaticValuesKey = Object.keys(s || {}).find(k => k.endsWith('AutomaticValues'));
               section("Automatic Values", automaticValuesKey ? s[automaticValuesKey] : null);
               break;
          case "Location":
               section("Event Location", s.eventLocation);
               break;
          case "Tracking":
               section("Tracking", s.tracking);
               section("Consent Type", s.consentType);
               break;
          case "User":
               section("User Details", s.userDetails);
               break;
          case "Time":
               section("Event Timestamp", s.eventTimestamp);
               break;
          case "Triggers":
               section("Triggers", s.triggers || s.trigger);
               break;
          case "Conversion":
               section("Conversion", s.conversion);
               break;
          case "Destinations":
               section("Destinations", s.destinations);
               break;
          case "Custom":
               section("Custom Values", s.customValues);
               break;
          case "Raw":
               const jsonContainer = document.createElement("div");
               jsonContainer.className = "dtl-json-container";
               const formattedJson = formatJsonWithSyntax(s);
               jsonContainer.innerHTML = formattedJson;
               tabContent.appendChild(jsonContainer);
               break;
          case "All":
          default:
               renderAll();
               break;
     }
}

function renderDebugView(pane, s) {
     const debugContainer = document.createElement("div");
     debugContainer.className = "dtl-debug-container";

     const infoBox = document.createElement("div");
     infoBox.className = "dtl-info-box";

     const infoTitle = document.createElement("div");
     infoTitle.className = "dtl-info-title";
     infoTitle.textContent = "🪲 Debug Information";

     const infoText = document.createElement("div");
     infoText.className = "dtl-info-text";
     infoText.innerHTML = "This view shows the moment when the event was triggered, including DOM element details, node path, and event context.";

     infoBox.appendChild(infoTitle);
     infoBox.appendChild(infoText);
     debugContainer.appendChild(infoBox);

     // Event Structure Validation Section
     const structureValidation = checkEventStructure(s);
     const validationSection = createStructureValidationSection(structureValidation);
     debugContainer.appendChild(validationSection);

     // Event Location Section
     if (s.eventLocation) {
          const section = createDebugSection("📍 Event Location", s.eventLocation);
          debugContainer.appendChild(section);
     }

     // DOM Node Information
     const domInfo = {
          eventType: s.event || "Unknown",
          timestamp: s.eventTimestamp || new Date().toISOString(),
          pageUrl: s.eventLocation?.url || window.location.href,
          triggeredBy: s.triggers || s.trigger || "Unknown"
     };
     const domSection = createDebugSection("🔍 DOM Context", domInfo);
     debugContainer.appendChild(domSection);

     // Tracking Info
     if (s.tracking) {
          const trackSection = createDebugSection("🎯 Tracking Details", s.tracking);
          debugContainer.appendChild(trackSection);
     }

     // User Context
     if (s.userDetails) {
          const userSection = createDebugSection("👤 User Context", s.userDetails);
          debugContainer.appendChild(userSection);
     }

     // Full Event Data
     const fullDataSection = createDebugSection("📋 Complete Event Data", s);
     debugContainer.appendChild(fullDataSection);

     pane.appendChild(debugContainer);
}

function createDebugSection(title, data) {
     const section = document.createElement("details");
     section.className = "dtl-debug-section";
     section.open = true;

     const summary = document.createElement("summary");
     summary.className = "dtl-debug-summary";
     summary.textContent = title;

     const content = document.createElement("div");
     content.className = "dtl-debug-content";

     const pre = document.createElement("pre");
     pre.className = "dtl-debug-pre";

     try {
          pre.textContent = JSON.stringify(data, null, 2);
     } catch (_) {
          pre.textContent = String(data);
     }

     content.appendChild(pre);
     section.appendChild(summary);
     section.appendChild(content);

     return section;
}

function createStructureValidationSection(validation) {
     const section = document.createElement("details");
     section.className = "dtl-debug-section";
     section.open = true;

     const summary = document.createElement("summary");
     summary.className = "dtl-debug-summary";

     const statusIcon = validation.isValid ? "✅" : "⚠️";
     const completenessText = `${validation.completeness}% Complete`;
     summary.innerHTML = `${statusIcon} Event Structure Validation - ${completenessText}`;

     const content = document.createElement("div");
     content.className = "dtl-debug-content";

     // Event name and overall status
     const headerDiv = document.createElement("div");
     headerDiv.style.cssText = "margin-bottom: 16px; padding: 12px; border-radius: 6px; background: #f8fafc;";
     headerDiv.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 4px;">Event: <span style="color: #0ea5e9;">${validation.eventName}</span></div>
          <div style="display: flex; gap: 12px; font-size: 13px;">
               <span>Status: <span style="color: ${validation.isValid ? '#16a34a' : '#dc2626'}; font-weight: 600;">${validation.isValid ? 'Valid' : 'Invalid'}</span></span>
               <span>Completeness: <span style="color: #0ea5e9; font-weight: 600;">${validation.completeness}%</span></span>
               <span>Total Properties: <span style="color: #6b7280;">${validation.totalProperties}</span></span>
          </div>
     `;
     content.appendChild(headerDiv);

     // Required properties section
     if (validation.structure.required.length > 0) {
          const requiredDiv = document.createElement("div");
          requiredDiv.style.cssText = "margin-bottom: 12px;";

          const requiredTitle = document.createElement("div");
          requiredTitle.style.cssText = "font-weight: 600; margin-bottom: 6px; color: #374151;";
          requiredTitle.textContent = "Required Properties:";
          requiredDiv.appendChild(requiredTitle);

          const requiredList = document.createElement("div");
          requiredList.style.cssText = "display: flex; flex-wrap: wrap; gap: 6px;";

          validation.structure.required.forEach(prop => {
               const propTag = document.createElement("span");
               const isPresent = validation.presentRequired.includes(prop);
               propTag.style.cssText = `
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    background: ${isPresent ? '#dcfce7' : '#fee2e2'};
                    color: ${isPresent ? '#166534' : '#991b1b'};
                    border: 1px solid ${isPresent ? '#bbf7d0' : '#fecaca'};
               `;
               propTag.textContent = `${isPresent ? '✓' : '✗'} ${prop}`;
               requiredList.appendChild(propTag);
          });

          requiredDiv.appendChild(requiredList);
          content.appendChild(requiredDiv);
     }

     // Optional properties section
     if (validation.structure.optional.length > 0) {
          const optionalDiv = document.createElement("div");
          optionalDiv.style.cssText = "margin-bottom: 12px;";

          const optionalTitle = document.createElement("div");
          optionalTitle.style.cssText = "font-weight: 600; margin-bottom: 6px; color: #374151;";
          optionalTitle.textContent = "Optional Properties:";
          optionalDiv.appendChild(optionalTitle);

          const optionalList = document.createElement("div");
          optionalList.style.cssText = "display: flex; flex-wrap: wrap; gap: 6px;";

          validation.structure.optional.forEach(prop => {
               const propTag = document.createElement("span");
               const isPresent = validation.presentOptional.includes(prop);
               propTag.style.cssText = `
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    background: ${isPresent ? '#f0f9ff' : '#f9fafb'};
                    color: ${isPresent ? '#0284c7' : '#6b7280'};
                    border: 1px solid ${isPresent ? '#bae6fd' : '#e5e7eb'};
               `;
               propTag.textContent = `${isPresent ? '✓' : '○'} ${prop}`;
               optionalList.appendChild(propTag);
          });

          optionalDiv.appendChild(optionalList);
          content.appendChild(optionalDiv);
     }

     // Unexpected properties section
     if (validation.unexpectedProperties.length > 0) {
          const unexpectedDiv = document.createElement("div");
          unexpectedDiv.style.cssText = "margin-bottom: 12px;";

          const unexpectedTitle = document.createElement("div");
          unexpectedTitle.style.cssText = "font-weight: 600; margin-bottom: 6px; color: #374151;";
          unexpectedTitle.textContent = "Unexpected Properties:";
          unexpectedDiv.appendChild(unexpectedTitle);

          const unexpectedList = document.createElement("div");
          unexpectedList.style.cssText = "display: flex; flex-wrap: wrap; gap: 6px;";

          validation.unexpectedProperties.forEach(prop => {
               const propTag = document.createElement("span");
               propTag.style.cssText = `
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    background: #fef3c7;
                    color: #92400e;
                    border: 1px solid #fde68a;
               `;
               propTag.textContent = `? ${prop}`;
               unexpectedList.appendChild(propTag);
          });

          unexpectedDiv.appendChild(unexpectedList);
          content.appendChild(unexpectedDiv);
     }

     // Summary statistics
     const statsDiv = document.createElement("div");
     statsDiv.style.cssText = "margin-top: 16px; padding: 12px; border-radius: 6px; background: #f1f5f9; font-size: 13px;";
     statsDiv.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 6px;">Summary:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div>✓ Required: ${validation.presentRequired.length}/${validation.structure.required.length}</div>
               <div>✓ Optional: ${validation.presentOptional.length}/${validation.structure.optional.length}</div>
               <div>✗ Missing Required: ${validation.missingRequired.length}</div>
               <div>○ Missing Optional: ${validation.missingOptional.length}</div>
          </div>
     `;
     content.appendChild(statsDiv);

     section.appendChild(summary);
     section.appendChild(content);

     return section;
}

function checkEventStructure(eventData) {
     if (!eventData || typeof eventData !== 'object') {
          return {
               isValid: false,
               error: 'Invalid event data - not an object',
               structure: null
          };
     }

     // Define expected fixed structure
     const expectedStructures = {
          common: {
               required: ['event', 'eventLocation', 'consentType', 'tracking', 'eventTimestamp', 'triggers', 'conversion', 'userDetails'],
               optional: ['eventType', 'eventTimestamp', 'eventScope', 'ListenLayer', 'customValues', 'eventID', 'destinations']
          }
     };

     const eventName = eventData.event || 'unknown';
     let expectedStructure = expectedStructures.common;

     // Check for AutomaticValues properties
     const automaticValuesKey = Object.keys(eventData).find(k => k.endsWith('AutomaticValues'));
     if (automaticValuesKey && !expectedStructure.optional.includes(automaticValuesKey)) {
          expectedStructure.required.push(automaticValuesKey);
     }

     // Validate structure
     const validation = {
          eventName: eventName,
          isValid: true,
          missingRequired: [],
          missingOptional: [],
          presentRequired: [],
          presentOptional: [],
          unexpectedProperties: [],
          structure: expectedStructure,
          totalProperties: Object.keys(eventData).length
     };

     // Check required properties
     expectedStructure.required.forEach(prop => {
          if (eventData.hasOwnProperty(prop) || (prop === automaticValuesKey && eventData[automaticValuesKey])) {
               validation.presentRequired.push(prop);
          } else {
               validation.missingRequired.push(prop);
               validation.isValid = false;
          }
     });

     // Check optional properties
     expectedStructure.optional.forEach(prop => {
          if (eventData.hasOwnProperty(prop)) {
               validation.presentOptional.push(prop);
          } else {
               validation.missingOptional.push(prop);
          }
     });

     // Check for unexpected properties
     const allExpected = [...expectedStructure.required, ...expectedStructure.optional];
     Object.keys(eventData).forEach(prop => {
          if (!allExpected.includes(prop)) {
               validation.unexpectedProperties.push(prop);
          }
     });

     // Calculate completeness percentage
     const totalExpected = expectedStructure.required.length + expectedStructure.optional.length;
     const totalPresent = validation.presentRequired.length + validation.presentOptional.length;
     validation.completeness = Math.round((totalPresent / totalExpected) * 100);

     return validation;
}

function shouldShowEvent(eventName) {
     if (!currentSettings) return true;

     // Check if logging is enabled
     if (!currentSettings.eventLogging.enabled) return false;

     // Check ignored events
     if (currentSettings.filters.ignoredEvents.includes(eventName)) {
          return false;
     }

     // Check whitelist (onlyShowEvents)
     if (currentSettings.filters.onlyShowEvents.length > 0) {
          return currentSettings.filters.onlyShowEvents.includes(eventName);
     }

     return true;
}

function pushTracked(item) {
     // Items from background are always pre-formatted
     // Debug logging
     console.log('pushTracked received:', item);

     // Validate item structure
     if (!item || typeof item !== 'object') {
          console.warn('pushTracked received invalid item (not an object):', item);
          return;
     }

     if (!('index' in item) || !('eventName' in item) || !('time' in item) || !('payload' in item)) {
          console.warn('pushTracked received malformed item (missing required properties):', item);
          return;
     }

     // Apply event filter based on settings
     if (!shouldShowEvent(item.eventName)) {
          return; // Skip this event
     }

     trackedItems.push(item);

     // Maintain max items (use settings or default)
     const maxItems = currentSettings?.eventLogging?.maxStoredEvents || MAX_ITEMS;
     if (trackedItems.length > maxItems) {
          trackedItems.shift();
     }

     // Re-render the list
     render();
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', init);
} else {
     init();
}
