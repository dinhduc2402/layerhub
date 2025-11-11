// popup.js
const outputElement = document.getElementById('dataLayerOutput');

// Hàm hiển thị dữ liệu
function renderData(data) {
     // Chỉ lấy 5 phần tử cuối cùng để dễ xem
     const history = data.slice(-5);

     // Hiển thị dữ liệu JSON đẹp hơn
     outputElement.innerHTML = `<pre>${JSON.stringify(history, null, 2)}</pre>`;
}

// Lắng nghe tin nhắn từ Content Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
     if (message.type === "INITIAL_LOAD" || message.type === "NEW_PUSH") {
          renderData(message.data);
     }
});

// Yêu cầu Content Script gửi lại data (trong trường hợp mở popup sau khi push đã xảy ra)
// Cần một cơ chế phức tạp hơn để xử lý trạng thái tốt hơn, nhưng đây là bước khởi đầu.
// Hiện tại, nó chỉ nhận khi có push mới hoặc load ban đầu.