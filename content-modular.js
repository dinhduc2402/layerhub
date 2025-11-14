// content-modular.js - Main content script (modular version)

import { nowTimeString, getEventNameFromItem, shouldIgnoreItem } from './src/utils.js';
import { createBackButton, createTopMenu } from './src/ui-components.js';
import { renderDebugView, renderEventDetailView, renderTabContent } from './src/render.js';

(function () {
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
          const eventName = getEventNameFromItem(item);
          title.textContent = eventName;
          detailViewMode = "eventDetail";
          renderDetail();
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
          body.style.overflow = "hidden";

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
          detailPane.style.overflow = "hidden";
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

          const backButton = createBackButton(() => showListView());
          const topMenu = createTopMenu(
               detailViewMode,
               () => { detailViewMode = "eventDetail"; renderDetail(); },
               () => { detailViewMode = "debug"; renderDetail(); }
          );

          pane.appendChild(backButton);
          pane.appendChild(topMenu);

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

          if (detailViewMode === "debug") {
               renderDebugView(pane, s);
               return;
          }

          const tabContent = renderEventDetailView(pane, s, tabsSpec, detailActiveTab, (newTab) => {
               detailActiveTab = newTab;
               renderDetail();
          });

          renderTabContent(tabContent, s, detailActiveTab);
     }

     function pushTracked(item) {
          if (shouldIgnoreItem(item)) return;
          const nextIndex = trackedItems.length + 1;
          trackedItems.push({ index: nextIndex, time: Date.now(), eventName: getEventNameFromItem(item), payload: item });
          if (trackedItems.length > MAX_ITEMS) trackedItems.shift();
          render();
     }

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
          currentView = "list";
          try { trackedItems.length = 0; } catch (_) { }
          awaitingInitial = true;
          try { document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_INITIAL')); } catch (_) { }
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
     document.addEventListener('LH_DL_PUSH', (e) => {
          try { pushTracked(e.detail?.item); } catch (_) { }
     });
})();