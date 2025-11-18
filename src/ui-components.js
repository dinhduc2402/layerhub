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

export function createAccountDetailView(accountData) {
     const container = document.createElement("div");
     container.style.cssText = "padding: 16px; height: 100%; overflow: auto;";

     // Account Header Section
     const headerSection = document.createElement("div");
     headerSection.style.cssText = "background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);";

     const accountTitle = document.createElement("h2");
     accountTitle.textContent = "Account Details";
     accountTitle.style.cssText = "margin: 0 0 16px 0; font-size: 20px; font-weight: 700;";

     const accountInfo = document.createElement("div");
     accountInfo.style.cssText = "display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;";

     const accountFields = [
          { label: "Account ID", value: accountData.accountID },
          { label: "Account Name", value: accountData.accountName },
          { label: "Account Level", value: accountData.accountLevel },
          { label: "Timezone", value: accountData.accountTimestamps?.timezone || "N/A" }
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
          { label: "Blocked", value: accountData.isBlocked, type: "danger" },
          { label: "New", value: accountData.isNew, type: "success" },
          { label: "Synced", value: accountData.isSynced, type: "info" },
          { label: "Display Info", value: accountData.displayInfo, type: "success" }
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
     const domainsSection = createCollapsibleSection("Enabled Domains", accountData.enabledDomain?.length || 0);
     const domainsList = document.createElement("div");
     domainsList.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; padding: 12px;";

     if (accountData.enabledDomain?.length) {
          accountData.enabledDomain.forEach(domain => {
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
     const listenersSection = createCollapsibleSection("Enabled Listeners", Object.keys(accountData.enabledListeners || {}).length);
     const listenersGrid = document.createElement("div");
     listenersGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; padding: 12px;";

     Object.entries(accountData.enabledListeners || {}).forEach(([key, listener]) => {
          const listenerCard = createListenerCard(key, listener);
          listenersGrid.appendChild(listenerCard);
     });

     listenersSection.appendChild(listenersGrid);
     container.appendChild(listenersSection);

     // Consent Rules Section
     const consentSection = createCollapsibleSection("Consent Rules", accountData.consentRules?.length || 0);
     const consentList = document.createElement("div");
     consentList.style.cssText = "padding: 12px;";

     if (accountData.consentRules?.length) {
          accountData.consentRules.forEach(rule => {
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
     const destinationsSection = createCollapsibleSection("Destinations", Object.keys(accountData.destinations || {}).length);
     const destinationsGrid = document.createElement("div");
     destinationsGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; padding: 12px;";

     Object.entries(accountData.destinations || {}).forEach(([key, destination]) => {
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