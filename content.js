// content.js

(function () {
     // Chỉ hiển thị trên domain chứa "hostedstaging"
     // const host = location.hostname || "";
     // if (!host.includes("hostedstaging")) return;

     // Tránh khởi tạo nhiều lần
     if (window.__layerhub_datalayer_inited__) return;
     window.__layerhub_datalayer_inited__ = true;

     const ROOT_ID = "lh-dl-root";
     const MAX_ITEMS = 200;
     /** @type {Array<{index:number,time:number,eventName:string,payload:any}>} */
     const trackedItems = [];
     let selectedItem = null;
     let detailActiveTab = "Raw";
     let currentView = "list"; // "list" or "detail"
     let detailViewMode = "eventDetail"; // "eventDetail" or "debug"
     let currentMainView = "events"; // "events" or "account"

     // Get account data from Listenlayer
     const accountData = window.Listenlayer.getAccount();

     function nowTimeString(ts) {
          const d = new Date(ts);
          return d.toLocaleTimeString();
     }

     function getEventNameFromItem(item) {
          if (!item || typeof item !== "object") return typeof item;
          if (item.event && typeof item.event === "string") return item.event;
          const keys = Object.keys(item);
          return keys.length ? keys[0] : "object";
     }

     function showListView() {
          const root = ensurePanel();
          const listPane = root.shadowRoot.getElementById("lh-list");
          const detailPane = root.shadowRoot.getElementById("lh-detail");
          const title = root.shadowRoot.getElementById("lh-title");
          currentView = "list";
          currentMainView = "events";
          listPane.classList.add("dtl-visible");
          listPane.classList.remove("dtl-hidden");
          detailPane.classList.add("dtl-hidden");
          detailPane.classList.remove("dtl-visible");
          title.textContent = "LayerHub Datalayer";
     }

     function showDetailView(item) {
          const root = ensurePanel();
          const listPane = root.shadowRoot.getElementById("lh-list");
          const detailPane = root.shadowRoot.getElementById("lh-detail");
          const title = root.shadowRoot.getElementById("lh-title");
          currentView = "detail";
          selectedItem = item;
          listPane.classList.add("dtl-hidden");
          listPane.classList.remove("dtl-visible");
          detailPane.classList.add("dtl-visible");
          detailPane.classList.remove("dtl-hidden");
          // Remove "event" from the title, show just the event type
          const eventName = getEventNameFromItem(item);
          title.textContent = eventName;
          detailViewMode = "eventDetail"; // Reset to event detail view
          renderDetail();
     }

     function showAccountView() {
          const root = ensurePanel();
          const listPane = root.shadowRoot.getElementById("lh-list");
          const detailPane = root.shadowRoot.getElementById("lh-detail");
          const title = root.shadowRoot.getElementById("lh-title");
          currentMainView = "account";
          listPane.classList.add("dtl-hidden");
          listPane.classList.remove("dtl-visible");
          detailPane.classList.add("dtl-visible");
          detailPane.classList.remove("dtl-hidden");
          title.textContent = "Account Details";

          // Render account detail view
          detailPane.innerHTML = "";
          detailPane.appendChild(createAccountDetailView(accountData));
     }

     function showEventsView() {
          const root = ensurePanel();
          const listPane = root.shadowRoot.getElementById("lh-list");
          const detailPane = root.shadowRoot.getElementById("lh-detail");
          const title = root.shadowRoot.getElementById("lh-title");
          currentMainView = "events";
          showListView();
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

     function highlightSearchResults(container, searchTerm) {
          if (!searchTerm) {
               container.innerHTML = container.textContent.replace(/<[^>]*>/g, '');
               const formattedJson = formatJsonWithSyntax(selectedItem);
               container.innerHTML = formattedJson;
               return;
          }

          let text = container.textContent;
          let highlightedText = text;

          // Find all occurrences of the search term
          const regex = new RegExp('(' + searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
          highlightedText = highlightedText.replace(regex, '<mark style="background: #fbbf24; color: #000; padding: 1px 2px; border-radius: 2px;">$1</mark>');

          // Re-apply syntax highlighting while preserving search highlights
          container.innerHTML = highlightedText
               .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    if (match.includes('<mark>')) return match; // Skip if already highlighted
                    let cls = 'text-gray-300';
                    if (/^"/.test(match)) {
                         if (/:$/.test(match)) {
                              cls = 'text-purple-400 font-semibold';
                         } else {
                              cls = 'text-green-400';
                         }
                    } else if (/true|false/.test(match)) {
                         cls = 'text-blue-400';
                    } else if (/null/.test(match)) {
                         cls = 'text-gray-500 italic';
                    } else {
                         cls = 'text-orange-400';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
               })
               .replace(/([\[\]{},])/g, '<span class="text-gray-500">$1</span>');
     }

     function shouldIgnoreItem(item) {
          if (item == null) return true;
          const t = typeof item;
          if (t !== "object") return true;
          if (typeof item.event === "string" && item.event.trim() !== "") return false;
          const keys = Object.keys(item);
          if (!keys.length) return true;
          if (keys[0] === "0") return true;
          return false;
     }

     function ensurePanel() {
          if (document.getElementById(ROOT_ID)) return document.getElementById(ROOT_ID);

          const mount = document.createElement("div");
          mount.id = ROOT_ID;
          mount.className = "dtl-root";
          // Critical inline styles to override website CSS
          mount.style.all = "initial";
          mount.style.position = "fixed";
          mount.style.right = "0";
          mount.style.top = "0";
          mount.style.height = "100vh";
          mount.style.transform = "translateX(0)";
          mount.style.zIndex = "2147483647";
          mount.style.fontFamily = "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
          const shadow = mount.attachShadow({ mode: "open" });

          const container = document.createElement("div");
          container.setAttribute("part", "container");
          container.className = "dtl-container";

          const header = document.createElement("div");
          header.className = "dtl-header";

          const title = document.createElement("div");
          title.id = "lh-title";
          title.textContent = "LayerHub Datalayer";
          title.className = "dtl-title";

          // Create dropdown menu container
          const dropdownContainer = document.createElement("div");
          dropdownContainer.className = "dtl-dropdown-container";
          dropdownContainer.style.cssText = "position: relative; display: inline-block; margin-left: 8px;";

          // Create dropdown menu icon with SVG
          const dropdownIcon = document.createElement("span");
          dropdownIcon.className = "dtl-dropdown-icon";
          dropdownIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>`;
          dropdownIcon.style.cssText = "cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s ease; display: flex; align-items: center; justify-content: center;";
          dropdownIcon.setAttribute("title", "Account Menu");

          // Create dropdown menu content
          const dropdownMenu = document.createElement("div");
          dropdownMenu.className = "dtl-dropdown-menu";
          dropdownMenu.style.cssText = "position: absolute; top: 100%; right: 0; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 120px; z-index: 1000; display: none; padding: 8px 0;";

          // Create dropdown menu items
          const menuItems = [
               { text: "Account", action: () => showAccountView() },
               { text: "Events", action: () => showEventsView() }
          ];

          menuItems.forEach(item => {
               const menuItem = document.createElement("div");
               menuItem.className = "dtl-dropdown-item";
               menuItem.textContent = item.text;
               menuItem.style.cssText = "padding: 8px 12px; cursor: pointer; font-size: 13px; color: #374151; transition: background-color 0.15s ease;";
               menuItem.addEventListener("click", item.action);
               menuItem.addEventListener("mouseenter", () => {
                    menuItem.style.backgroundColor = "#f0f9ff";
               });
               menuItem.addEventListener("mouseleave", () => {
                    menuItem.style.backgroundColor = "transparent";
               });
               dropdownMenu.appendChild(menuItem);
          });

          // Add hover functionality
          dropdownIcon.addEventListener("mouseenter", () => {
               dropdownMenu.style.display = "block";
               dropdownIcon.style.backgroundColor = "rgba(255,255,255,0.2)";
          });

          dropdownContainer.addEventListener("mouseleave", () => {
               dropdownMenu.style.display = "none";
               dropdownIcon.style.backgroundColor = "transparent";
          });

          dropdownContainer.appendChild(dropdownIcon);
          dropdownContainer.appendChild(dropdownMenu);

          const counter = document.createElement("span");
          counter.id = "lh-count";
          counter.textContent = "0";
          counter.className = "dtl-counter";

          header.appendChild(title);
          header.appendChild(dropdownContainer);
          header.appendChild(counter);

          const body = document.createElement("div");
          body.className = "dtl-body";

          const listPane = document.createElement("div");
          listPane.id = "lh-list";
          listPane.className = "dtl-pane";

          const detailPane = document.createElement("div");
          detailPane.id = "lh-detail";
          detailPane.className = "dtl-pane";

          const table = document.createElement("table");
          table.className = "dtl-table";

          const thead = document.createElement("thead");
          const trh = document.createElement("tr");
          ["#", "Event", "Time"].forEach((h) => {
               const th = document.createElement("th");
               th.textContent = h;
               if (h === "#") {
                    th.className = "dtl-table-header-first";
               } else {
                    th.className = "dtl-table-header";
               }
               trh.appendChild(th);
          });
          thead.appendChild(trh);

          const tbody = document.createElement("tbody");
          tbody.id = "lh-tbody";

          table.appendChild(thead);
          table.appendChild(tbody);
          listPane.appendChild(table);
          body.appendChild(listPane);
          body.appendChild(detailPane);

          // Load CSS styles (moved to external file for maintainability)
          const style = document.createElement("style");
          style.textContent = `
/* Root and Layout Classes */
.dtl-root {
position: fixed !important;
right: 0 !important;
top: 0 !important;
height: 100vh !important;
transform: translateX(0);
z-index: 2147483647 !important;
font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
display: none !important;
}

.dtl-container {
width: 600px;
height: 100vh;
background: #fff;
border: 1px solid rgba(0,0,0,.1);
border-radius: 12px 0 0 12px;
box-shadow: 0 8px 30px rgba(0,0,0,.12);
overflow: hidden;
color: #1f2937;
position: relative;
transition: transform .25s ease;
}

.dtl-header {
display: flex;
align-items: center;
justify-content: space-between;
padding: 12px 16px;
background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
color: #fff;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
border-bottom: 1px solid rgba(255,255,255,0.1);
}

.dtl-title {
font-weight: 700;
font-size: 15px;
letter-spacing: 0.025em;
}

/* Dropdown Menu Styles */
.dtl-dropdown-container {
position: relative;
display: inline-block;
margin-left: 8px;
}

.dtl-dropdown-icon {
cursor: pointer;
padding: 4px;
border-radius: 4px;
transition: background-color 0.2s ease;
display: flex;
align-items: center;
justify-content: center;
}

.dtl-dropdown-icon:hover {
background-color: rgba(255,255,255,0.2);
}

.dtl-dropdown-icon svg {
width: 16px;
height: 16px;
stroke: currentColor;
}

.dtl-dropdown-menu {
position: absolute;
top: 100%;
right: 0;
background: #ffffff;
border: 1px solid #e5e7eb;
border-radius: 6px;
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
min-width: 120px;
z-index: 1000;
display: none;
padding: 8px 0;
}

.dtl-dropdown-item {
padding: 8px 12px;
cursor: pointer;
font-size: 13px;
color: #374151;
transition: background-color 0.15s ease;
}

.dtl-dropdown-item:hover {
background-color: #f0f9ff;
}

.dtl-counter {
background: rgba(255,255,255,.25);
padding: 4px 10px;
border-radius: 12px;
font-size: 12px;
font-weight: 600;
box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.dtl-body {
background: #fff;
height: calc(100vh - 44px);
position: relative;
overflow: hidden;
}

.dtl-pane {
width: 100%;
height: 100%;
overflow: auto;
display: none;
}

.dtl-pane.dtl-visible {
display: block;
}

.dtl-table {
width: 100%;
border-collapse: collapse;
font-size: 13px;
font-weight: 500;
}

.dtl-table-header {
text-align: left;
padding: 10px 8px;
border-bottom: 2px solid #e5e7eb;
color: #374151;
font-weight: 600;
font-size: 12px;
background-color: #f9fafb;
}

.dtl-table-header-first {
text-align: right;
padding: 10px 8px;
border-bottom: 2px solid #e5e7eb;
color: #374151;
font-weight: 600;
font-size: 12px;
background-color: #f9fafb;
}

.dtl-table-row {
cursor: pointer;
border-bottom: 1px solid #f1f5f9;
transition: background-color 0.15s ease;
}

.dtl-table-row:hover {
background: #f0f9ff;
}

.dtl-table-row:last-child {
border-bottom: none;
}

.dtl-table-cell {
padding: 10px 8px;
color: #374151;
}

.dtl-table-cell:first-child {
color: #6b7280;
font-weight: 600;
text-align: right;
}

.dtl-handle {
position: absolute;
left: -36px;
top: 50%;
transform: translateY(-50%);
width: 36px;
height: 84px;
border-radius: 8px 0 0 8px;
border: 1px solid rgba(0,0,0,.1);
background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
color: #fff;
cursor: pointer;
font-weight: 700;
letter-spacing: 1px;
writing-mode: vertical-rl;
text-orientation: mixed;
box-shadow: 0 2px 8px rgba(0,0,0,0.15);
transition: all 0.2s ease;
}

.dtl-handle:hover {
box-shadow: 0 4px 12px rgba(0,0,0,0.25);
transform: translateY(-50%) translateX(-2px);
}

.dtl-nav-bar {
display: flex;
gap: 8px;
align-items: center;
padding: 8px;
border-bottom: 1px solid #e5e7eb;
}

.dtl-button {
padding: 8px 12px;
border: 1px solid #e5e7eb;
border-radius: 8px;
cursor: pointer;
font-size: 13px;
font-weight: 500;
transition: all 0.15s ease;
background: #ffffff;
color: #374151;
}

.dtl-button:hover {
background: #f8fafc;
border-color: #cbd5e1;
}

.dtl-button-primary {
background: #0ea5e9;
color: #ffffff;
border-color: #0ea5e9;
}

.dtl-layout {
display: flex;
gap: 0;
}

.dtl-side-menu {
width: 70px;
background: #ffffff;
border-right: 1px solid #e5e7eb;
display: flex;
flex-direction: column;
padding: 12px 6px;
gap: 4px;
}

.dtl-menu-item {
padding: 6px 4px;
cursor: pointer;
border-radius: 10px;
transition: all 0.2s ease;
}

.dtl-menu-item:hover {
background: #f0f9ff;
transform: scale(1.05);
}

.dtl-menu-item.active {
background: #0ea5e9;
}

.dtl-menu-label {
font-size: 12px;
font-weight: 500;
text-align: left;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 60px;
color: #6b7280;
}

.dtl-menu-item.active .dtl-menu-label {
color: #ffffff;
}

.dtl-tab-content {
flex: 1;
height: 100%;
overflow: auto;
padding: 8px;
}

.dtl-json-container {
background: #0f172a;
border-radius: 12px;
padding: 16px;
overflow: auto;
height: calc(100vh - 150px);
font-family: 'Fira Code', 'Consolas', monospace;
font-size: 13px;
line-height: 1.5;
color: #e5e7eb;
white-space: pre;
}

.dtl-debug-container {
padding: 16px;
height: calc(100vh - 100px);
overflow: auto;
}

.dtl-info-box {
background: #f0f9ff;
border: 1px solid #bae6fd;
border-radius: 8px;
padding: 16px;
margin-bottom: 16px;
}

.dtl-info-title {
font-weight: 600;
color: #0c4a6e;
margin-bottom: 8px;
font-size: 14px;
}

.dtl-info-text {
color: #0e7490;
font-size: 13px;
line-height: 1.6;
}

.dtl-debug-section {
border: 1px solid #e5e7eb;
border-radius: 8px;
margin-bottom: 12px;
background: #ffffff;
}

.dtl-debug-summary {
cursor: pointer;
padding: 12px 14px;
font-weight: 600;
background: #f8fafc;
border-bottom: 1px solid #e5e7eb;
color: #374151;
font-size: 13px;
}

.dtl-debug-content {
padding: 12px 14px;
}

.dtl-debug-pre {
margin: 0;
background: #0f172a;
color: #e5e7eb;
padding: 12px;
border-radius: 6px;
overflow: auto;
font-size: 12px;
line-height: 1.5;
font-family: 'Fira Code', 'Consolas', monospace;
}

/* Legacy and utility classes */
.muted {
color: #6b7280;
font-weight: 500;
}

pre {
margin: 0;
background: #0f172a;
color: #e5e7eb;
padding: 10px;
border-radius: 8px;
overflow: auto;
font-size: 12px;
line-height: 1.5;
}

details {
border: 1px solid #e5e7eb;
border-radius: 8px;
margin: 8px 0;
background: #fff;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

details > summary {
cursor: pointer;
list-style: none;
padding: 12px 14px;
font-weight: 600;
background: #f8fafc;
border-bottom: 1px solid #e5e7eb;
border-radius: 8px;
color: #374151;
transition: background-color 0.15s ease;
}

details[open] > summary {
border-bottom-color: #e5e7eb;
background: #f1f5f9;
}

.kv {
display: grid;
grid-template-columns: 140px 1fr;
gap: 8px;
padding: 12px 14px;
}

.kv .k {
color: #6b7280;
font-weight: 500;
}

.kv pre {
grid-column: 1 / -1;
width: 100%;
}

/* Text color utilities */
.text-gray-300 { color: #d1d5db; }
.text-gray-500 { color: #94a3b8; }
.text-green-400 { color: #34d399; }
.text-orange-400 { color: #fb923c; }
.text-blue-400 { color: #60a5fa; }
.text-purple-400 { color: #c084fc; }
.font-semibold { font-weight: 600; }
.italic { font-style: italic; }

/* State classes */
.dtl-hidden { display: none !important; }
.dtl-visible { display: block !important; }
.dtl-collapsed { transform: translateX(100%); }
          `;
          shadow.appendChild(style);

          // Toggle handle similar to Monica sidebar
          const handle = document.createElement("button");
          handle.textContent = "DL";
          handle.setAttribute("title", "Toggle Datalayer Panel");
          handle.className = "dtl-handle";

          let isCollapsed = false;
          try { isCollapsed = localStorage.getItem("lh-collapsed") === "1"; } catch (_) { }
          function applyCollapsed() {
               if (isCollapsed) {
                    container.classList.add("dtl-collapsed");
               } else {
                    container.classList.remove("dtl-collapsed");
               }
          }
          handle.addEventListener("click", () => {
               isCollapsed = !isCollapsed;
               applyCollapsed();
               try { localStorage.setItem("lh-collapsed", isCollapsed ? "1" : "0"); } catch (_) { }
          });
          // Hover effects are now handled by CSS

          // Ensure JSON <pre> spans full width inside key-value grid
          const kvFixStyle = document.createElement("style");
          kvFixStyle.textContent = ".kv pre{grid-column:1 / -1;width:100%}";
          shadow.appendChild(kvFixStyle);
          shadow.appendChild(container);
          container.appendChild(header);
          container.appendChild(body);
          container.appendChild(handle);

          // Ensure we append to body, not documentElement
          if (document.body) {
               document.body.appendChild(mount);
          } else {
               document.documentElement.appendChild(mount);
          }
          // Start with panel hidden
          mount.classList.add("dtl-hidden");
          mount.classList.remove("dtl-visible");
          applyCollapsed();
          return mount;
     }

     function render() {
          const root = ensurePanel();
          const tbody = root.shadowRoot.getElementById("lh-tbody");
          const counter = root.shadowRoot.getElementById("lh-count");
          counter.textContent = String(trackedItems.length);
          tbody.innerHTML = "";
          for (let i = trackedItems.length - 1; i >= 0; i--) {
               const it = trackedItems[i];
               const tr = document.createElement("tr");
               tr.className = "dtl-table-row";
               const tdIdx = document.createElement("td");
               tdIdx.textContent = String(it.index);
               tdIdx.className = "dtl-table-cell";
               const tdEvent = document.createElement("td");
               tdEvent.textContent = it.eventName;
               tdEvent.className = "dtl-table-cell";
               const tdTime = document.createElement("td");
               tdTime.textContent = nowTimeString(it.time);
               tdTime.className = "dtl-table-cell muted";
               tr.appendChild(tdIdx); tr.appendChild(tdEvent); tr.appendChild(tdTime);
               tr.addEventListener("click", () => {
                    showDetailView(it.payload);
               });

               tbody.appendChild(tr);
          }

          // Show list view by default
          if (currentView === "list") {
               showListView();
          }
     }

     function renderDetail() {
          const root = ensurePanel();
          const pane = root.shadowRoot.getElementById("lh-detail");
          pane.innerHTML = "";
          if (!selectedItem) return;

          const s = selectedItem;

          // Navigation bar with Back button and mode tabs on one row
          const navBar = document.createElement("div");
          navBar.className = "dtl-nav-bar";

          // Back button
          const backButton = document.createElement("button");
          backButton.textContent = "← Back to Events";
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

          // Tabs
          // Find any property ending with "AutomaticValues" (udAutomaticValues, ugAutomaticValues, pageAutomaticValues, etc.)
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

          // Event Detail mode continues below
          // Create layout container with side menu
          const layoutContainer = document.createElement("div");
          layoutContainer.className = "dtl-layout";

          // Fixed side menu - map tabs to menu items
          const sideMenu = document.createElement("div");
          sideMenu.className = "dtl-side-menu";

          // Map current tabs to menu labels
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

               // Container for label only
               const menuItem = document.createElement("div");
               menuItem.className = "dtl-menu-item";
               if (t.key === detailActiveTab) {
                    menuItem.classList.add("active");
               }

               // Label
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

          // Add scrollable container for tab content
          const tabContent = document.createElement("div");
          tabContent.className = "dtl-tab-content";

          layoutContainer.appendChild(sideMenu);
          layoutContainer.appendChild(tabContent);
          pane.appendChild(layoutContainer);

          function section(label, content) {
               if (content == null) return;
               const det = document.createElement("details");
               det.open = true; // Always open by default
               const sum = document.createElement("summary");
               sum.textContent = label;
               const inner = document.createElement("div");
               inner.className = "kv";
               // If object-like, pretty print, else value
               if (typeof content === "object") {
                    const pre = document.createElement("pre");
                    try {
                         pre.textContent = JSON.stringify(content, null, 2);
                    } catch (_) {
                         pre.textContent = String(content);
                    }
                    // Make JSON block span the full width inside the .kv grid
                    try { pre.style.gridColumn = "1 / -1"; } catch (_) { }
                    try { pre.style.width = "100%"; } catch (_) { }
                    inner.appendChild(pre);
               } else {
                    const pre = document.createElement("pre");
                    pre.textContent = String(content);
                    // Ensure value block spans full width in the grid
                    try { pre.style.gridColumn = "1 / -1"; } catch (_) { }
                    try { pre.style.width = "100%"; } catch (_) { }
                    inner.appendChild(pre);
               }
               det.appendChild(sum);
               det.appendChild(inner);
               tabContent.appendChild(det);
          }

          const renderAll = () => {
               // Find any property ending with "AutomaticValues"
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
                    // Find any property ending with "AutomaticValues"
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
                    // Full JSON display with syntax highlighting and color styling
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

     function pushTracked(item) {
          if (shouldIgnoreItem(item)) return;
          const nextIndex = trackedItems.length + 1;
          trackedItems.push({ index: nextIndex, time: Date.now(), eventName: getEventNameFromItem(item), payload: item });
          if (trackedItems.length > MAX_ITEMS) trackedItems.shift();
          render();
     }

     // Page-context hook is injected by background via chrome.scripting

     // Toggle on click from extension icon
     let awaitingInitial = false;
     let initialReqTimer = null;
     let initialReqCount = 0;

     function cancelInitialRequester() {
          if (initialReqTimer) { try { clearInterval(initialReqTimer); } catch (_) { } initialReqTimer = null; }
          initialReqCount = 0; awaitingInitial = false;
     }

     function showPanel() {
          const mount = ensurePanel();
          mount.classList.remove("dtl-hidden");
          mount.classList.add("dtl-visible");
          // reset to list view and request initial snapshot from page
          currentView = "list";
          try { trackedItems.length = 0; } catch (_) { }
          awaitingInitial = true;
          try { document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_INITIAL')); } catch (_) { }
          // Retry requests in case the page hook registers slightly later
          initialReqCount = 0;
          initialReqTimer = setInterval(() => {
               if (!awaitingInitial) { cancelInitialRequester(); return; }
               initialReqCount++;
               try { document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_INITIAL')); } catch (_) { }
               if (initialReqCount >= 50) cancelInitialRequester();
          }, 200);
     }

     function hidePanel() {
          const mount = document.getElementById(ROOT_ID);
          if (mount) {
               mount.classList.add("dtl-hidden");
               mount.classList.remove("dtl-visible");
          }
     }

     function togglePanel() {
          const mount = document.getElementById(ROOT_ID);
          if (!mount || mount.classList.contains("dtl-hidden")) {
               showPanel();
          } else {
               hidePanel();
          }
     }

     chrome.runtime.onMessage.addListener((msg) => {
          if (msg && msg.type === "TOGGLE_PANEL") {
               togglePanel();
          }
     });

     // Listen to events from page context and render
     // Request initial snapshot when the hook announces it's ready
     window.addEventListener('LH_DL_READY', () => { try { document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_INITIAL')); } catch (_) { } });
     document.addEventListener('LH_DL_READY', () => { try { document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_INITIAL')); } catch (_) { } });
     window.addEventListener('LH_DL_INITIAL', (e) => {
          try {
               if (!awaitingInitial) return;
               const items = e.detail?.items || [];
               items.forEach((x) => pushTracked(x));
          } catch (_) { }
          cancelInitialRequester();
     });
     document.addEventListener('LH_DL_INITIAL', (e) => {
          try {
               if (!awaitingInitial) return;
               const items = e.detail?.items || [];
               items.forEach((x) => pushTracked(x));
          } catch (_) { }
          cancelInitialRequester();
     });
     // Listen on document only to avoid duplicate events (window + document)
     document.addEventListener('LH_DL_PUSH', (e) => {
          try { pushTracked(e.detail?.item); } catch (_) { }
     });

     function createAccountDetailView(data) {
          const container = document.createElement("div");
          container.style.cssText = "padding: 16px; height: calc(100vh - 84px); overflow: auto;";

          // Account Header Section
          const headerSection = document.createElement("div");
          headerSection.style.cssText = "background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);";

          const accountTitle = document.createElement("h2");
          accountTitle.textContent = "Account Details";
          accountTitle.style.cssText = "margin: 0 0 16px 0; font-size: 20px; font-weight: 700;";

          const accountInfo = document.createElement("div");
          accountInfo.style.cssText = "display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;";

          const accountFields = [
               { label: "Account ID", value: data.accountID },
               { label: "Account Name", value: data.accountName },
               { label: "Account Level", value: data.accountLevel },
               { label: "Timezone", value: data.accountTimestamps?.timezone || "N/A" }
          ];

          accountFields.forEach(field => {
               const fieldDiv = document.createElement("div");
               fieldDiv.innerHTML = `<div style="opacity: 0.9; font-size: 12px; margin-bottom: 4px;">${field.label}:</div><div style="font-weight: 600;">${field.value}</div>`;
               accountInfo.appendChild(fieldDiv);
          });

          headerSection.appendChild(accountTitle);
          headerSection.appendChild(accountInfo);

          // Status Badges
          const statusSection = document.createElement("div");
          statusSection.style.cssText = "display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;";

          const badges = [
               { label: "Blocked", value: data.isBlocked, type: "danger" },
               { label: "New", value: data.isNew, type: "success" },
               { label: "Synced", value: data.isSynced, type: "info" },
               { label: "Display Info", value: data.displayInfo, type: "success" }
          ];

          badges.forEach(badge => {
               const badgeEl = document.createElement("span");
               badgeEl.textContent = `${badge.label}: ${badge.value ? "Yes" : "No"}`;
               const bgColor = badge.value ?
                    (badge.type === "danger" ? "#dc2626" : badge.type === "success" ? "#16a34a" : "#2563eb") :
                    "#6b7280";
               badgeEl.style.cssText = `background: ${bgColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;`;
               statusSection.appendChild(badgeEl);
          });

          headerSection.appendChild(statusSection);
          container.appendChild(headerSection);

          // Enabled Domains Section
          const domainsSection = createCollapsibleSection("Enabled Domains", data.enabledDomain?.length || 0);
          const domainsList = document.createElement("div");
          domainsList.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; padding: 12px;";

          if (data.enabledDomain?.length) {
               data.enabledDomain.forEach(domain => {
                    const domainTag = document.createElement("span");
                    domainTag.textContent = domain.domain;
                    domainTag.style.cssText = "background: #f0f9ff; color: #0284c7; padding: 6px 12px; border-radius: 16px; font-size: 12px; border: 1px solid #bae6fd;";
                    domainsList.appendChild(domainTag);
               });
          } else {
               domainsList.innerHTML = "<div style='color: #6b7280; padding: 12px;'>No domains configured</div>";
          }

          domainsSection.appendChild(domainsList);
          container.appendChild(domainsSection);

          // Listeners Section
          const listenersSection = createCollapsibleSection("Enabled Listeners", Object.keys(data.enabledListeners || {}).length);
          const listenersGrid = document.createElement("div");
          listenersGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; padding: 12px;";

          Object.entries(data.enabledListeners || {}).forEach(([key, listener]) => {
               const listenerCard = createListenerCard(key, listener);
               listenersGrid.appendChild(listenerCard);
          });

          listenersSection.appendChild(listenersGrid);
          container.appendChild(listenersSection);

          // Consent Rules Section
          const consentSection = createCollapsibleSection("Consent Rules", data.consentRules?.length || 0);
          const consentList = document.createElement("div");
          consentList.style.cssText = "padding: 12px;";

          if (data.consentRules?.length) {
               data.consentRules.forEach(rule => {
                    const ruleItem = document.createElement("div");
                    ruleItem.style.cssText = "background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #0ea5e9;";
                    ruleItem.innerHTML = `
                    <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">${rule.name}</div>
                    <div style="font-size: 12px; color: #6b7280;">Method: ${rule.consentMethod}</div>
                    <div style="font-size: 12px; color: #6b7280;">Regions: ${rule.geographicRegions?.map(r => r.continent || r.stateProvinces || "Worldwide").join(", ")}</div>
               `;
                    consentList.appendChild(ruleItem);
               });
          } else {
               consentList.innerHTML = "<div style='color: #6b7280;'>No consent rules configured</div>";
          }

          consentSection.appendChild(consentList);
          container.appendChild(consentSection);

          // Destinations Section
          const destinationsSection = createCollapsibleSection("Destinations", Object.keys(data.destinations || {}).length);
          const destinationsGrid = document.createElement("div");
          destinationsGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; padding: 12px;";

          Object.entries(data.destinations || {}).forEach(([key, destination]) => {
               const destCard = document.createElement("div");
               destCard.style.cssText = "background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; text-align: center;";
               destCard.innerHTML = `
               <div style="font-weight: 600; color: #166534; margin-bottom: 4px; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
               <div style="font-size: 11px; color: #16a34a;">${destination.isCustom ? "Custom" : "Built-in"}</div>
          `;
               destinationsGrid.appendChild(destCard);
          });

          destinationsSection.appendChild(destinationsGrid);
          container.appendChild(destinationsSection);

          return container;
     }

     function createCollapsibleSection(title, count) {
          const section = document.createElement("details");
          section.style.cssText = "border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);";
          section.open = true;

          const summary = document.createElement("summary");
          summary.style.cssText = "cursor: pointer; padding: 14px 16px; font-weight: 600; background: #f8fafc; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px; display: flex; justify-content: space-between; align-items: center; list-style: none;";
          summary.innerHTML = `
          <span>${title}</span>
          <span style="background: #0ea5e9; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${count}</span>
     `;

          section.appendChild(summary);
          return section;
     }

     function createListenerCard(key, listener) {
          const card = document.createElement("div");
          card.style.cssText = "background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.2s ease;";

          const statusColor = listener.enabled ? "#16a34a" : "#dc2626";
          const statusText = listener.enabled ? "Enabled" : "Disabled";

          card.innerHTML = `
          <div style="font-weight: 600; color: #92400e; margin-bottom: 6px; font-size: 13px;">${listener.listenerName}</div>
          <div style="font-size: 11px; color: #78350f; margin-bottom: 8px;">Type: ${listener.type}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
               <span style="background: ${statusColor}; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 500;">${statusText}</span>
               <span style="font-size: 10px; color: #92400e;">${Object.keys(listener.features || {}).length} features</span>
          </div>
     `;

          card.addEventListener("mouseenter", () => {
               card.style.transform = "translateY(-2px)";
               card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          });

          card.addEventListener("mouseleave", () => {
               card.style.transform = "translateY(0)";
               card.style.boxShadow = "none";
          });

          return card;
     }
})();