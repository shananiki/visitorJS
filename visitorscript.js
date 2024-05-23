document.addEventListener('DOMContentLoaded', () => {
    const totalVisitorsSpan = document.getElementById('total-visitors');
    const currentVisitorsSpan = document.getElementById('current-visitors');
    
    let wsv;
    
    function connect() {
        const wsv = new WebSocket(`${location.protocol === 'http:' ? 'ws:' : 'wss:'}//cursor.shananiki.org` + ':21000');
    
        wsv.onopen = () => {
            console.log("Connected to WebSocket server!");
        };
    
        wsv.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'visitors') {
            totalVisitorsSpan.textContent = data.allVisitors;
            currentVisitorsSpan.textContent = data.currentVisitors;
        }
        };
    
        wsv.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }
    
    connect();
});
    