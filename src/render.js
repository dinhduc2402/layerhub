// render.js - Rendering functions

import { formatJsonWithSyntax } from './utils.js';
import { createDebugSection, createBackButton, createTopMenu, createSideMenuItem, TAB_TO_MENU_MAP } from './ui-components.js';

export function renderDebugView(pane, s) {
     const debugContainer = document.createElement("div");
     debugContainer.style.cssText = "padding: 16px; height: calc(100vh - 260px); overflow: auto;";

     const infoBox = document.createElement("div");
     infoBox.style.cssText = "background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin-bottom: 16px;";

     const infoTitle = document.createElement("div");
     infoTitle.style.cssText = "font-weight: 600; color: #0c4a6e; margin-bottom: 8px; font-size: 14px;";
     infoTitle.textContent = "🪲 Debug Information";

     const infoText = document.createElement("div");
     infoText.style.cssText = "color: #0e7490; font-size: 13px; line-height: 1.6;";
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

export function renderEventDetailView(pane, s, tabsSpec, detailActiveTab, onTabChange) {
     const layoutContainer = document.createElement("div");
     layoutContainer.style.cssText = "display: flex; height: calc(100vh - 260px); gap: 0;";

     const sideMenu = document.createElement("div");
     sideMenu.style.cssText = "width: 70px; background: #ffffff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; align-items: center; padding: 12px 0; gap: 4px; flex-shrink: 0;";

     tabsSpec.forEach(t => {
          const menuInfo = TAB_TO_MENU_MAP[t.key] || { icon: "•", label: t.key.substring(0, 6) };
          const menuItem = createSideMenuItem(menuInfo, t.key, detailActiveTab, () => onTabChange(t.key));
          sideMenu.appendChild(menuItem);
     });

     const tabContent = document.createElement("div");
     tabContent.style.cssText = "flex: 1; height: 100%; overflow: auto; padding: 8px;";

     layoutContainer.appendChild(sideMenu);
     layoutContainer.appendChild(tabContent);
     pane.appendChild(layoutContainer);

     return tabContent;
}

export function renderTabContent(tabContent, s, detailActiveTab) {
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
               try { pre.style.gridColumn = "1 / -1"; } catch (_) { }
               try { pre.style.width = "100%"; } catch (_) { }
               inner.appendChild(pre);
          } else {
               const pre = document.createElement("pre");
               pre.textContent = String(content);
               try { pre.style.gridColumn = "1 / -1"; } catch (_) { }
               try { pre.style.width = "100%"; } catch (_) { }
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
               jsonContainer.style.cssText = "background: #0f172a; border-radius: 12px; padding: 20px; overflow: auto; height: calc(100vh - 200px); font-family: 'Fira Code', 'Consolas', monospace; font-size: 13px; line-height: 1.5; color: #e5e7eb; white-space: pre;";
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