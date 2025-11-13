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
     let detailFullMode = false;
     let detailActiveTab = "Overview";
     let currentView = "list"; // "list" or "detail"

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
          listPane.style.display = "block";
          detailPane.style.display = "none";
          title.textContent = "LayerHub Datalayer";
     }

     function showDetailView(item) {
          const root = ensurePanel();
          const listPane = root.shadowRoot.getElementById("lh-list");
          const detailPane = root.shadowRoot.getElementById("lh-detail");
          const title = root.shadowRoot.getElementById("lh-title");
          currentView = "detail";
          selectedItem = item;
          listPane.style.display = "none";
          detailPane.style.display = "block";
          title.textContent = getEventNameFromItem(item);
          renderDetail();
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
          container.style.width = "600px";
          container.style.height = "100vh";
          container.style.background = "#fff";
          container.style.border = "1px solid rgba(0,0,0,.1)";
          container.style.borderRadius = "12px 0 0 12px";
          container.style.boxShadow = "0 8px 30px rgba(0,0,0,.12)";
          container.style.overflow = "hidden";
          container.style.color = "#1f2937";
          container.style.position = "relative";
          container.style.transition = "transform .25s ease";

          const header = document.createElement("div");
          header.style.display = "flex";
          header.style.alignItems = "center";
          header.style.justifyContent = "space-between";
          header.style.padding = "12px 16px";
          header.style.background = "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)";
          header.style.color = "#fff";
          header.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
          header.style.borderBottom = "1px solid rgba(255,255,255,0.1)";

          const title = document.createElement("div");
          title.id = "lh-title";
          title.textContent = "LayerHub Datalayer";
          title.style.fontWeight = "700";
          title.style.fontSize = "15px";
          title.style.letterSpacing = "0.025em";

          const counter = document.createElement("span");
          counter.id = "lh-count";
          counter.textContent = "0";
          counter.style.background = "rgba(255,255,255,.25)";
          counter.style.padding = "4px 10px";
          counter.style.borderRadius = "12px";
          counter.style.fontSize = "12px";
          counter.style.fontWeight = "600";
          counter.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";

          header.appendChild(title);
          header.appendChild(counter);

          const body = document.createElement("div");
          body.style.background = "#fff";
          body.style.padding = "8px";
          body.style.height = "calc(100vh - 44px)";
          body.style.position = "relative";

          const listPane = document.createElement("div");
          listPane.id = "lh-list";
          listPane.style.width = "100%";
          listPane.style.height = "100%";
          listPane.style.overflow = "auto";
          listPane.style.display = "none";

          const detailPane = document.createElement("div");
          detailPane.id = "lh-detail";
          detailPane.style.width = "100%";
          detailPane.style.height = "100%";
          detailPane.style.overflow = "auto";
          detailPane.style.display = "none";

          const table = document.createElement("table");
          table.style.width = "100%";
          table.style.borderCollapse = "collapse";
          table.style.fontSize = "13px";
          table.style.fontWeight = "500";

          const thead = document.createElement("thead");
          const trh = document.createElement("tr");
          ["#", "Event", "Time"].forEach((h) => {
               const th = document.createElement("th");
               th.textContent = h;
               th.style.textAlign = h === "#" ? "right" : "left";
               th.style.padding = "10px 8px";
               th.style.borderBottom = "2px solid #e5e7eb";
               th.style.color = "#374151";
               th.style.fontWeight = "600";
               th.style.fontSize = "12px";
               th.style.backgroundColor = "#f9fafb";
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

          const style = document.createElement("style");
          style.textContent = "tbody tr{cursor:pointer;border-bottom:1px solid #f1f5f9;transition:background-color 0.15s ease} tbody tr:hover{background:#f0f9ff} tbody tr:last-child{border-bottom:none} td{padding:10px 8px;color:#374151} td:first-child{color:#6b7280;font-weight:600} .muted{color:#6b7280;font-weight:500} pre{margin:0;background:#0f172a;color:#e5e7eb;padding:10px;border-radius:8px;overflow:auto;font-size:12px;line-height:1.5} details{border:1px solid #e5e7eb;border-radius:8px;margin:8px 0;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.05)} details>summary{cursor:pointer;list-style:none;padding:12px 14px;font-weight:600;background:#f8fafc;border-bottom:1px solid #e5e7eb;border-radius:8px;color:#374151;transition:background-color 0.15s ease} details[open]>summary{border-bottom-color:#e5e7eb;background:#f1f5f9} .kv{display:grid;grid-template-columns:140px 1fr;gap:8px;padding:12px 14px} .kv .k{color:#6b7280;font-weight:500} .toolbar{display:flex;align-items:center;justify-content:space-between;margin:8px 0 12px} .toolbar .title{font-weight:700;color:#1f2937;font-size:14px} .toolbar .actions{display:flex;gap:8px} .toolbar button{border:1px solid #d1d5db;background:#ffffff;color:#374151;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:500;transition:all 0.15s ease;box-shadow:0 1px 2px rgba(0,0,0,0.05)} .toolbar button:hover{background:#f8fafc;border-color:#9ca3af;box-shadow:0 2px 4px rgba(0,0,0,0.1)} .tabs{display:flex;gap:4px;flex-wrap:wrap;border-bottom:2px solid #e5e7eb;margin:8px 0 12px;padding-bottom:2px} .tab{border:1px solid transparent;background:transparent;color:#6b7280;padding:8px 14px;border-radius:8px 8px 0 0;cursor:pointer;font-size:13px;font-weight:500;transition:all 0.15s ease;position:relative;top:2px} .tab.active{background:#ffffff;color:#0ea5e9;border-color:#e5e7eb;border-bottom-color:#ffffff;font-weight:600;top:0} .tab:hover:not(.active){background:#f8fafc;color:#374151} .text-gray-300{color:#d1d5db} .text-gray-500{color:#94a3b8} .text-green-400{color:#34d399} .text-orange-400{color:#fb923c} .text-blue-400{color:#60a5fa} .text-purple-400{color:#c084fc} .font-semibold{font-weight:600} .italic{font-style:italic}";

          // Toggle handle similar to Monica sidebar
          const handle = document.createElement("button");
          handle.textContent = "DL";
          handle.setAttribute("title", "Toggle Datalayer Panel");
          handle.style.position = "absolute";
          handle.style.left = "-36px";
          handle.style.top = "50%";
          handle.style.transform = "translateY(-50%)";
          handle.style.width = "36px";
          handle.style.height = "84px";
          handle.style.borderRadius = "8px 0 0 8px";
          handle.style.border = "1px solid rgba(0,0,0,.1)";
          handle.style.background = "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)";
          handle.style.color = "#fff";
          handle.style.cursor = "pointer";
          handle.style.fontWeight = "700";
          handle.style.letterSpacing = "1px";
          handle.style.writingMode = "vertical-rl";
          handle.style.textOrientation = "mixed";
          handle.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
          handle.style.transition = "all 0.2s ease";

          let isCollapsed = false;
          try { isCollapsed = localStorage.getItem("lh-collapsed") === "1"; } catch (_) { }
          function applyCollapsed() {
               container.style.transform = isCollapsed ? "translateX(100%)" : "translateX(0)";
          }
          handle.addEventListener("click", () => {
               isCollapsed = !isCollapsed;
               applyCollapsed();
               try { localStorage.setItem("lh-collapsed", isCollapsed ? "1" : "0"); } catch (_) { }
          });
          handle.addEventListener("mouseenter", () => {
               handle.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
               handle.style.transform = "translateY(-50%) translateX(-2px)";
          });
          handle.addEventListener("mouseleave", () => {
               handle.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
               handle.style.transform = "translateY(-50%)";
          });

          shadow.appendChild(style);
          // Ensure JSON <pre> spans full width inside key-value grid
          const kvFixStyle = document.createElement("style");
          kvFixStyle.textContent = ".kv pre{grid-column:1 / -1;width:100%}";
          shadow.appendChild(kvFixStyle);
          shadow.appendChild(container);
          container.appendChild(header);
          container.appendChild(body);
          container.appendChild(handle);

          (document.body || document.documentElement).appendChild(mount);
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
               const tdIdx = document.createElement("td");
               tdIdx.textContent = String(it.index);
               tdIdx.style.textAlign = "right";
               const tdEvent = document.createElement("td");
               tdEvent.textContent = it.eventName;
               const tdTime = document.createElement("td");
               tdTime.textContent = nowTimeString(it.time);
               tdTime.className = "muted";
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

          // Back button
          const backButton = document.createElement("button");
          backButton.textContent = "← Back to Events";
          backButton.style.cssText = "margin-bottom: 12px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 13px; color: #374151; font-weight: 500; transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;";
          backButton.addEventListener("click", () => {
               showListView();
          });
          backButton.addEventListener("mouseenter", () => {
               backButton.style.background = "#e2e8f0";
               backButton.style.borderColor = "#cbd5e1";
          });
          backButton.addEventListener("mouseleave", () => {
               backButton.style.background = "#f8fafc";
               backButton.style.borderColor = "#e5e7eb";
          });

          // Toolbar with actions
          const toolbar = document.createElement("div");
          toolbar.className = "toolbar";
          const title = document.createElement("div");
          title.className = "title";
          title.textContent = getEventNameFromItem(s);
          const actions = document.createElement("div");
          actions.className = "actions";

          if (detailFullMode) {
               // Full JSON mode - simplified toolbar
               const btnCopy = document.createElement("button");
               btnCopy.textContent = "📋 Copy";
               const btnExit = document.createElement("button");
               btnExit.textContent = "Exit Full JSON";
               actions.appendChild(btnCopy); actions.appendChild(btnExit);

               pane.appendChild(backButton);
               pane.appendChild(toolbar);
               toolbar.appendChild(title); toolbar.appendChild(actions);

               // Search bar
               const searchContainer = document.createElement("div");
               searchContainer.style.cssText = "margin-bottom: 16px; position: relative;";
               const searchInput = document.createElement("input");
               searchInput.type = "text";
               searchInput.placeholder = "Search JSON...";
               searchInput.style.cssText = "width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; background: #f8fafc; color: #374151;";
               searchContainer.appendChild(searchInput);
               pane.appendChild(searchContainer);

               // Full JSON display with syntax highlighting
               const jsonContainer = document.createElement("div");
               jsonContainer.style.cssText = "background: #0f172a; border-radius: 12px; padding: 20px; overflow: auto; max-height: calc(100vh - 200px); font-family: 'Fira Code', 'Consolas', monospace; font-size: 13px; line-height: 1.5; color: #e5e7eb; white-space: pre;";

               const formattedJson = formatJsonWithSyntax(s);
               jsonContainer.innerHTML = formattedJson;
               pane.appendChild(jsonContainer);

               // Search functionality
               searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    highlightSearchResults(jsonContainer, searchTerm);
               });

               // Copy functionality
               btnCopy.addEventListener('click', () => {
                    try {
                         navigator.clipboard.writeText(JSON.stringify(s, null, 2));
                         btnCopy.textContent = "✓ Copied!";
                         setTimeout(() => {
                              btnCopy.textContent = "📋 Copy";
                         }, 2000);
                    } catch (_) {
                         // Fallback for older browsers
                         const textArea = document.createElement("textarea");
                         textArea.value = JSON.stringify(s, null, 2);
                         document.body.appendChild(textArea);
                         textArea.select();
                         document.execCommand('copy');
                         document.body.removeChild(textArea);
                         btnCopy.textContent = "✓ Copied!";
                         setTimeout(() => {
                              btnCopy.textContent = "📋 Copy";
                         }, 2000);
                    }
               });

               btnExit.addEventListener('click', () => {
                    detailFullMode = false;
                    renderDetail();
               });

          } else {
               // Normal mode with tabs
               const btnExpand = document.createElement("button"); btnExpand.textContent = "Expand all";
               const btnCollapse = document.createElement("button"); btnCollapse.textContent = "Collapse all";
               const btnFull = document.createElement("button"); btnFull.textContent = "Full JSON";
               actions.appendChild(btnExpand); actions.appendChild(btnCollapse); actions.appendChild(btnFull);

               pane.appendChild(backButton);
               pane.appendChild(toolbar);
               toolbar.appendChild(title); toolbar.appendChild(actions);

               // Tabs
               const tabsSpec = [
                    { key: "Overview", available: true },
                    { key: "Page", available: !!s?.pageAutomaticValues },
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
                    detailActiveTab = tabsSpec[0]?.key || "Overview";
               }

               const tabs = document.createElement("div");
               tabs.className = "tabs";
               tabsSpec.forEach(t => {
                    const b = document.createElement("button");
                    b.className = "tab" + (t.key === detailActiveTab ? " active" : "");
                    b.textContent = t.key;
                    b.addEventListener("click", () => {
                         detailActiveTab = t.key;
                         renderDetail();
                    });
                    tabs.appendChild(b);
               });
               pane.appendChild(tabs);

               function section(label, content) {
                    if (content == null) return;
                    const det = document.createElement("details");
                    det.open = !detailFullMode;
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
                    pane.appendChild(det);
               }

               const renderAll = () => {
                    section("Overview", { event: s.event || getEventNameFromItem(s), eventType: s.eventType, eventID: s.eventID });
                    section("Page Automatic Values", s.pageAutomaticValues);
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
                    section("Raw JSON", s);
               };

               switch (detailActiveTab) {
                    case "Overview":
                         section("Overview", { event: s.event || getEventNameFromItem(s), eventType: s.eventType, eventID: s.eventID });
                         break;
                    case "Page":
                         section("Page Automatic Values", s.pageAutomaticValues);
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
                         section("Raw JSON", s);
                         break;
                    case "All":
                    default:
                         renderAll();
                         break;
               }

               // Action bindings
               btnExpand.addEventListener('click', () => {
                    pane.querySelectorAll('details').forEach(d => d.open = true);
               });
               btnCollapse.addEventListener('click', () => {
                    pane.querySelectorAll('details').forEach(d => d.open = false);
               });
               btnFull.addEventListener('click', () => {
                    detailFullMode = true;
                    renderDetail();
               });
          }
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
          mount.style.display = "block";
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
          if (mount) mount.style.display = "none";
     }

     function togglePanel() {
          const mount = document.getElementById(ROOT_ID);
          if (!mount || mount.style.display === "none") {
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
})();