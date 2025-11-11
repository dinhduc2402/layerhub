// Send a toggle message to the active tab when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
     if (!tab?.id) return;
     try {
          // Inject page-context hook (ignores page CSP)
          await chrome.scripting.executeScript({
               target: { tabId: tab.id },
               files: ["pagehook.js"],
               world: "MAIN"
          });
     } catch (e) {
          // ignore; still try to toggle panel
     }
     try {
          await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_PANEL" });
     } catch (e) {
          // Content script may not be ready yet on some protocols
     }
});


