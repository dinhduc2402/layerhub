// utils.js - Utility functions

export function nowTimeString(ts) {
     const d = new Date(ts);
     return d.toLocaleTimeString();
}

export function getEventNameFromItem(item) {
     if (!item || typeof item !== "object") return typeof item;
     if (item.event && typeof item.event === "string") return item.event;
     const keys = Object.keys(item);
     return keys.length ? keys[0] : "object";
}

export function shouldIgnoreItem(item) {
     if (item == null) return true;
     const t = typeof item;
     if (t !== "object") return true;
     if (typeof item.event === "string" && item.event.trim() !== "") return false;
     const keys = Object.keys(item);
     if (!keys.length) return true;
     if (keys[0] === "0") return true;
     return false;
}

export function formatJsonWithSyntax(obj) {
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

export function highlightSearchResults(container, searchTerm, selectedItem) {
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