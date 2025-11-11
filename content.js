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
          header.style.padding = "10px 12px";
          header.style.background = "#0ea5e9";
          header.style.color = "#fff";

          const title = document.createElement("div");
          title.textContent = "LayerHub Datalayer";
          title.style.fontWeight = "600";
          title.style.fontSize = "14px";

          const counter = document.createElement("span");
          counter.id = "lh-count";
          counter.textContent = "0";
          counter.style.background = "rgba(255,255,255,.2)";
          counter.style.padding = "2px 8px";
          counter.style.borderRadius = "999px";
          counter.style.fontSize = "12px";

          header.appendChild(title);
          header.appendChild(counter);

          const body = document.createElement("div");
          body.style.background = "#fff";
          body.style.padding = "8px";
          body.style.height = "calc(100vh - 44px)";
          body.style.display = "flex";
          body.style.gap = "8px";

          const listPane = document.createElement("div");
          listPane.id = "lh-list";
          listPane.style.flex = "1 1 55%";
          listPane.style.overflow = "auto";

          const detailPane = document.createElement("div");
          detailPane.id = "lh-detail";
          detailPane.style.flex = "1 1 45%";
          detailPane.style.overflow = "auto";
          detailPane.style.borderLeft = "1px solid #e5e7eb";
          detailPane.style.paddingLeft = "8px";

          const table = document.createElement("table");
          table.style.width = "100%";
          table.style.borderCollapse = "collapse";
          table.style.fontSize = "12px";

          const thead = document.createElement("thead");
          const trh = document.createElement("tr");
          ["#", "Event", "Time"].forEach((h) => {
               const th = document.createElement("th");
               th.textContent = h;
               th.style.textAlign = h === "#" ? "right" : "left";
               th.style.padding = "6px";
               th.style.borderBottom = "1px solid #e5e7eb";
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
          style.textContent = "tbody tr{cursor:pointer;} tbody tr:hover{background:#f8fafc} td{padding:6px;border-bottom:1px solid #f1f5f9} .muted{color:#6b7280} pre{margin:0;background:#0b1020;color:#e5e7eb;padding:8px;border-radius:8px;overflow:auto} details{border:1px solid #e5e7eb;border-radius:8px;margin:6px 0;background:#fff} details>summary{cursor:pointer;list-style:none;padding:8px 10px;font-weight:600;background:#f8fafc;border-bottom:1px solid #e5e7eb;border-radius:8px} details[open]>summary{border-bottom-color:#e5e7eb} .kv{display:grid;grid-template-columns:140px 1fr;gap:6px;padding:8px 10px} .kv .k{color:#6b7280} .toolbar{display:flex;align-items:center;justify-content:space-between;margin:2px 0 6px} .toolbar .title{font-weight:700} .toolbar .actions{display:flex;gap:6px} .toolbar button{border:1px solid #cbd5e1;background:#f8fafc;color:#0f172a;padding:4px 8px;border-radius:6px;cursor:pointer} .toolbar button:hover{background:#e2e8f0}";

          // Toggle handle similar to Monica sidebar
          const handle = document.createElement("button");
          handle.textContent = "DL";
          handle.setAttribute("title", "Toggle Datalayer Panel");
          handle.style.position = "absolute";
          handle.style.left = "-36px";
          handle.style.top = "50%";
          handle.style.transform = "translateY(-50%)";
          handle.style.width = "32px";
          handle.style.height = "80px";
          handle.style.borderRadius = "8px 0 0 8px";
          handle.style.border = "1px solid rgba(0,0,0,.1)";
          handle.style.background = "#0ea5e9";
          handle.style.color = "#fff";
          handle.style.cursor = "pointer";
          handle.style.fontWeight = "600";
          handle.style.letterSpacing = "1px";
          handle.style.writingMode = "vertical-rl";
          handle.style.textOrientation = "mixed";

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

          shadow.appendChild(style);
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
                    selectedItem = it.payload;
                    renderDetail();
               });

               tbody.appendChild(tr);
          }

          // Render default detail for newest item if nothing selected
          if (!selectedItem && trackedItems.length) {
               selectedItem = trackedItems[trackedItems.length - 1].payload;
          }
          renderDetail();
     }

     function renderDetail() {
          const root = ensurePanel();
          const pane = root.shadowRoot.getElementById("lh-detail");
          pane.innerHTML = "";
          if (!selectedItem) return;

          // Toolbar with actions
          const toolbar = document.createElement("div");
          toolbar.className = "toolbar";
          const title = document.createElement("div");
          title.className = "title";
          title.textContent = getEventNameFromItem(selectedItem);
          const actions = document.createElement("div");
          actions.className = "actions";
          const btnExpand = document.createElement("button"); btnExpand.textContent = "Expand all";
          const btnCollapse = document.createElement("button"); btnCollapse.textContent = "Collapse all";
          const btnFull = document.createElement("button"); btnFull.textContent = detailFullMode ? "Exit full" : "Full JSON";
          actions.appendChild(btnExpand); actions.appendChild(btnCollapse); actions.appendChild(btnFull);
          toolbar.appendChild(title); toolbar.appendChild(actions);
          pane.appendChild(toolbar);

          function section(label, content) {
               if (content == null) return;
               const det = document.createElement("details");
               det.open = !detailFullMode; // close in full mode
               const sum = document.createElement("summary");
               sum.textContent = label;
               const inner = document.createElement("div");
               inner.className = "kv";
               // If object-like, pretty print, else value
               if (typeof content === "object") {
                    const pre = document.createElement("pre");
                    pre.textContent = JSON.stringify(content, null, 2);
                    inner.appendChild(pre);
               } else {
                    const pre = document.createElement("pre");
                    pre.textContent = String(content);
                    inner.appendChild(pre);
               }
               det.appendChild(sum);
               det.appendChild(inner);
               pane.appendChild(det);
          }

          // Curated sections in professional order
          const s = selectedItem;
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
          // Full JSON
          section("Raw JSON", s);

          // Action bindings
          btnExpand.addEventListener('click', () => {
               pane.querySelectorAll('details').forEach(d => d.open = true);
          });
          btnCollapse.addEventListener('click', () => {
               pane.querySelectorAll('details').forEach(d => d.open = false);
          });
          btnFull.addEventListener('click', () => {
               detailFullMode = !detailFullMode;
               renderDetail();
          });
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
          // reset and request initial snapshot from page
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