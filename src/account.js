// account.js - Account data management and UI functions

// UI component functions
export function createAccountDetailView(data) {
     const container = document.createElement("div");
     container.style.cssText = "padding: 16px; height: calc(100vh - 84px); overflow: auto;";

     // Handle null or undefined data
     if (!data) {
          const noDataMsg = document.createElement("div");
          noDataMsg.style.cssText = "text-align: center; padding: 40px; color: #6b7280; font-size: 16px;";
          noDataMsg.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
            <div style="font-weight: 600; margin-bottom: 8px;">No Account Data Available</div>
            <div style="font-size: 14px;">Account data could not be retrieved from the page.</div>
        `;
          container.appendChild(noDataMsg);
          return container;
     }

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
