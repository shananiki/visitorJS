require ('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');
const cors = require('cors');

const app = express();

// dotenv
const port = process.env.PORT;
var CERT_FILE = process.env.CERT_PATH;
var KEY_FILE = process.env.KEY_PATH;

const credentials = {
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE)
};

// CORS setup
const corsOptions = {
    origin: 'https://cursor.shananiki.org',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};
app.use(cors(corsOptions));

// Create HTTPS server
const server = https.createServer(credentials, app);
const wss = new WebSocket.Server({ server });

let cursors = {}; // To store cursor positions of all clients

let currentVisitors = 0;
let allVisitors = 0;

wss.on('connection', (ws) => {
    allVisitors++;
    currentVisitors++;
   

    ws.send(JSON.stringify({ type: 'welcome', message: "You're a visitor!" }));

    ws.on('error', console.error);
    
    broadcastVisitors();

    ws.on('close', () => {
        currentVisitors--;
        broadcastVisitors();
    });
});

function broadcastVisitors() {
    const data = JSON.stringify({ type: 'visitors', allVisitors, currentVisitors });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
