// ui-components.js - UI component creation functions

export function createDebugSection(title, data) {
     const section = document.createElement("details");
     section.style.cssText = "border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; background: #ffffff;";
     section.open = true;

     const summary = document.createElement("summary");
     summary.style.cssText = "cursor: pointer; padding: 12px 14px; font-weight: 600; background: #f8fafc; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px;";
     summary.textContent = title;

     const content = document.createElement("div");
     content.style.cssText = "padding: 12px 14px;";

     const pre = document.createElement("pre");
     pre.style.cssText = "margin: 0; background: #0f172a; color: #e5e7eb; padding: 12px; border-radius: 6px; overflow: auto; font-size: 12px; line-height: 1.5; font-family: 'Fira Code', 'Consolas', monospace;";

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

export function createBackButton(onClickHandler) {
     const backButton = document.createElement("button");
     backButton.textContent = "← Back to Events";
     backButton.style.cssText = "margin-bottom: 12px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 13px; color: #374151; font-weight: 500; transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;";
     backButton.addEventListener("click", onClickHandler);
     backButton.addEventListener("mouseenter", () => {
          backButton.style.background = "#e2e8f0";
          backButton.style.borderColor = "#cbd5e1";
     });
     backButton.addEventListener("mouseleave", () => {
          backButton.style.background = "#f8fafc";
          backButton.style.borderColor = "#e5e7eb";
     });
     return backButton;
}

export function createTopMenu(detailViewMode, onEventDetailClick, onDebugClick) {
     const topMenu = document.createElement("div");
     topMenu.style.cssText = "display: flex; gap: 8px; margin-bottom: 12px;";

     const eventDetailBtn = document.createElement("button");
     eventDetailBtn.textContent = "Event Detail";
     eventDetailBtn.style.cssText = "padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s ease;";
     if (detailViewMode === "eventDetail") {
          eventDetailBtn.style.background = "#0ea5e9";
          eventDetailBtn.style.color = "#ffffff";
          eventDetailBtn.style.borderColor = "#0ea5e9";
     } else {
          eventDetailBtn.style.background = "#ffffff";
          eventDetailBtn.style.color = "#374151";
     }

     const debugBtn = document.createElement("button");
     debugBtn.textContent = "Debug";
     debugBtn.style.cssText = "padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s ease;";
     if (detailViewMode === "debug") {
          debugBtn.style.background = "#0ea5e9";
          debugBtn.style.color = "#ffffff";
          debugBtn.style.borderColor = "#0ea5e9";
     } else {
          debugBtn.style.background = "#ffffff";
          debugBtn.style.color = "#374151";
     }

     eventDetailBtn.addEventListener("click", onEventDetailClick);
     debugBtn.addEventListener("click", onDebugClick);

     topMenu.appendChild(eventDetailBtn);
     topMenu.appendChild(debugBtn);

     return topMenu;
}

export function createSideMenuItem(menuInfo, tabKey, detailActiveTab, onClickHandler) {
     const menuItem = document.createElement("div");
     menuItem.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 4px; cursor: pointer; border-radius: 10px; transition: all 0.2s ease; width: 100%;";


     const labelDiv = document.createElement("div");
     labelDiv.style.cssText = "font-size: 9px; font-weight: 500; line-height: 1; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px;";
     labelDiv.textContent = menuInfo.label;

     menuItem.appendChild(labelDiv);
     menuItem.setAttribute("title", tabKey);

     if (tabKey === detailActiveTab) {
          menuItem.style.background = "#0ea5e9";
          labelDiv.style.color = "#ffffff";
     } else {
          labelDiv.style.color = "#6b7280";
     }

     menuItem.addEventListener("click", onClickHandler);

     menuItem.addEventListener("mouseenter", () => {
          if (tabKey !== detailActiveTab) {
               menuItem.style.background = "#f0f9ff";
          }
          menuItem.style.transform = "scale(1.05)";
     });

     menuItem.addEventListener("mouseleave", () => {
          if (tabKey !== detailActiveTab) {
               menuItem.style.background = "transparent";
          }
          menuItem.style.transform = "scale(1)";
     });

     return menuItem;
}

export const TAB_TO_MENU_MAP = {
     "Automatic Values": { label: "Auto" },
     "Location": { label: "Location" },
     "Tracking": { label: "Track" },
     "User": { label: "User" },
     "Time": { label: "Time" },
     "Triggers": { label: "Trigger" },
     "Conversion": { label: "Convert" },
     "Destinations": { label: "Dest" },
     "Custom": { label: "Custom" },
     "Raw": { label: "Raw" },
     "All": { label: "All" }
};

// Account-related functions moved to src/account.js