// content.js

(function () {
     // only show "hostedstaging"
     // const host = location.hostname || "";
     // if (!host.includes("hostedstaging")) return;

     // Avoid multiple initializations
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

     // Import account functions
     import('./src/account.js').then(accountModule => {
          // Make account functions globally available
          window.createAccountDetailView = accountModule.createAccountDetailView;
     }).catch(err => console.error('Failed to load account module:', err));

     function buildAccountView(data) {
          window.accountDetailViewElement = window.createAccountDetailView(data);

          // If account view is currently visible, update it immediately
          if (currentMainView === "account") {
               const root = ensurePanel();
               const detailPane = root.shadowRoot.getElementById("lh-detail");
               if (detailPane) {
                    detailPane.innerHTML = "";
                    if (window.accountDetailViewElement) {
                         detailPane.appendChild(window.accountDetailViewElement);
                    }
               }
          }
     }

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
          if (window.accountDetailViewElement) {
               detailPane.appendChild(window.accountDetailViewElement);
          } else {
               // Show loading state initially
               const loadingMsg = document.createElement("div");
               loadingMsg.id = "lh-account-loading";
               loadingMsg.style.cssText = "text-align: center; padding: 40px; color: #6b7280; font-size: 16px;";
               loadingMsg.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
                    <div style="font-weight: 600; margin-bottom: 8px;">Loading Account Data...</div>
                    <div style="font-size: 14px;">Please wait while we retrieve your account information.</div>
               `;
               detailPane.appendChild(loadingMsg);
          }
     }

     function showEventsView() {
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
               {
                    text: "Account", action: () => {
                         // Request account data before showing the view
                         try {
                              document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_ACCOUNT'));
                              // Show the view immediately, it will be updated when data arrives
                              showAccountView();
                         } catch (_) { }
                    }
               },
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

          // const counter = document.createElement("span");
          // counter.id = "lh-count";
          // counter.textContent = "0";
          // counter.className = "dtl-counter";

          header.appendChild(title);
          header.appendChild(dropdownContainer);
          // header.appendChild(counter);

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

          // Load CSS styles from external file
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = "text/css";
          link.href = chrome.runtime.getURL("styles.css");
          shadow.appendChild(link);

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
          // const counter = root.shadowRoot.getElementById("lh-count");
          // counter.textContent = String(trackedItems.length);
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

          // Create summary with validation status
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

     // Function to check if event has enough and correct fixed structures
     function checkEventStructure(eventData) {
          if (!eventData || typeof eventData !== 'object') {
               return {
                    isValid: false,
                    error: 'Invalid event data - not an object',
                    structure: null
               };
          }

          // Define expected fixed structure based on event type
          const expectedStructures = {
               // Common properties that should be present in most events
               common: {
                    required: ['event', 'eventLocation', 'consentType', 'tracking', 'eventTimestamp', 'triggers', 'conversion', 'userDetails'],
                    optional: ['eventType', 'eventTimestamp', 'eventScope', 'ListenLayer', 'customValues', 'eventID', 'destinations']
               }
          };

          // Get event name
          const eventName = eventData.event || 'unknown';
          let expectedStructure = expectedStructures.common;

          // Check for AutomaticValues properties (dynamic based on event type)
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


     document.addEventListener('LH_DL_ACCOUNT_DATA', (e) => {
          try { buildAccountView(e.detail?.accountData); } catch (_) { }
     });

     // Request account data when panel is shown
     const originalShowPanel = showPanel;
     showPanel = function () {
          originalShowPanel();
          try { document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_ACCOUNT')); } catch (_) { }
     };

})();