const totalVisitorsSpan = document.getElementById('total-visitors');
const currentVisitorsSpan = document.getElementById('current-visitors');

let ws;

function connect() {
    const ws = new WebSocket(`${location.protocol === 'http:' ? 'ws:' : 'wss:'}//${window.location.host}` + ':21000');

    ws.onopen = () => {
        console.log("Connected to WebSocket server!");
    };

    ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'visitors') {
        totalVisitorsSpan.textContent = data.allVisitors;
        currentVisitorsSpan.textContent = data.currentVisitors;
    }
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

window.onload = connect;
