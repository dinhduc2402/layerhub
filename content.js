// content.js - Message relay between pagehook.js (page context) and background service worker

(function () {
     // Avoid multiple initializations
     if (window.__layerhub_relay_inited__) return;
     window.__layerhub_relay_inited__ = true;

     /**
      * Listen for DOM events from pagehook.js (page context)
      * Forward them to background service worker
      */

     // Initial dataLayer snapshot
     document.addEventListener('LH_DL_INITIAL', (e) => {
          chrome.runtime.sendMessage({
               type: 'LH_DL_INITIAL',
               data: e.detail
          }).catch(() => {
               // Background may not be ready
          });
     });

     // New dataLayer item pushed
     document.addEventListener('LH_DL_PUSH', (e) => {
          chrome.runtime.sendMessage({
               type: 'LH_DL_PUSH',
               data: e.detail
          }).catch(() => {
               // Background may not be ready
          });
     });

     // Pagehook is ready
     document.addEventListener('LH_DL_READY', (e) => {
          chrome.runtime.sendMessage({
               type: 'LH_DL_READY',
               data: e.detail
          }).catch(() => {
               // Background may not be ready
          });
     });

     // Account data received
     document.addEventListener('LH_DL_ACCOUNT_DATA', (e) => {
          chrome.runtime.sendMessage({
               type: 'LH_DL_ACCOUNT_DATA',
               data: e.detail
          }).catch(() => {
               // Background may not be ready
          });
     });

     /**
      * Listen for messages from background service worker
      * Forward them to pagehook.js via DOM events
      */
     chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
          switch (msg.type) {
               case 'REQUEST_INITIAL':
                    // Side panel requesting initial dataLayer snapshot
                    document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_INITIAL'));
                    break;

               case 'REQUEST_ACCOUNT':
                    // Side panel requesting account data
                    document.dispatchEvent(new CustomEvent('LH_DL_REQUEST_ACCOUNT'));
                    break;
          }
     });
})();
