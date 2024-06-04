const totalVisitorsSpan = document.getElementById('total-visitors');
const currentVisitorsSpan = document.getElementById('current-visitors');
let wsv;
function connect() {
        const ws = new WebSocket('wss://HOSTNAME:30000');

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.type === 'visitors') {
                document.getElementById('current-visitors').innerText = data.current;
                document.getElementById('total-visitors').innerText = data.all;
            }
        };

}
window.onload = connect;
