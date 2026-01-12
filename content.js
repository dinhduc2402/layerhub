// content.js - Message relay between pagehook.js (page context) and background service worker

(function () {
     // Avoid multiple initializations
     if (window.__layerhub_relay_inited__) return;
     window.__layerhub_relay_inited__ = true;

     /**
      * Listen for DOM events from pagehook.js (page context)
      * Forward them to background service worker
      */

     /**
      * Helper to safely send messages (handles extension context invalidation)
      */
     function safeSendMessage(message) {
          try {
               if (!chrome.runtime?.id) {
                    // Extension context invalidated (extension was reloaded)
                    return;
               }
               chrome.runtime.sendMessage(message).catch((error) => {
                    // Silently ignore if extension context is invalidated
                    if (error.message?.includes('Extension context invalidated')) {
                         return;
                    }
                    // Background may not be ready for other errors
               });
          } catch (e) {
               // Extension context invalidated
          }
     }

     // Initial dataLayer snapshot
     document.addEventListener('LH_DL_INITIAL', (e) => {
          safeSendMessage({
               type: 'LH_DL_INITIAL',
               data: e.detail
          });
     });

     // New dataLayer item pushed
     document.addEventListener('LH_DL_PUSH', (e) => {
          safeSendMessage({
               type: 'LH_DL_PUSH',
               data: e.detail
          });
     });

     // Pagehook is ready
     document.addEventListener('LH_DL_READY', (e) => {
          safeSendMessage({
               type: 'LH_DL_READY',
               data: e.detail
          });
     });

     // Account data received
     document.addEventListener('LH_DL_ACCOUNT_DATA', (e) => {
          safeSendMessage({
               type: 'LH_DL_ACCOUNT_DATA',
               data: e.detail
          });
     });

     /**
      * Listen for messages from background service worker
      * Forward them to pagehook.js via DOM events
      */
     try {
          if (chrome.runtime?.id) {
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
          }
     } catch (e) {
          // Extension context invalidated - content script is orphaned
     }
})();
