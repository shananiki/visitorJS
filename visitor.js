require ('dotenv').config();
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const mysql = require('mysql2/promise');



const app = express();

const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
var CERT_PATH = process.env.CERT_PATH;
var KEY_PATH = process.env.KEY_PATH;
var HOST_PORT = process.env.HOST_PORT;
var HOST_IP = process.env.HOST_IP;

const server = https.createServer({
    cert: fs.readFileSync(CERT_PATH),
    key: fs.readFileSync(KEY_PATH)
});

const wss = new WebSocket.Server({ server });

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});

async function getVisitorCount(){
    try{
        const connection = await pool.getConnection();

        const sql = `SELECT visitorcounter FROM visitors`;
        const [rows] = await connection.execute(sql);

        connection.release();

        return rows[0].visitorcounter; 
    }catch(error){
        return 0;
    }
}

async function setVisitorCounter(value){
    try{
		const connection = await pool.getConnection();

        let sql = "UPDATE `visitors` SET `visitorcounter`=? WHERE 1";
		const [rows] = await connection.execute(sql, [value]);
		connection.release();
    }catch(error){
    }
}

async function init(){
    allVisitors = await getVisitorCount();
}

let currentVisitors = 0;
let allVisitors = 0;
function broadcastVisitors() {
        const data = JSON.stringify({ type: 'visitors', all: allVisitors, current: currentVisitors });
        wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) {
                client.send(data);
        }
        });

}

wss.on('connection', (ws) => {
    currentVisitors++;
    allVisitors++;
    setVisitorCounter(allVisitors);
    console.log(`New connection. Current visitors: ${currentVisitors}`);

    broadcastVisitors();


    ws.on('close', () => {
        currentVisitors--;
        console.log(`Connection closed. Current visitors: ${currentVisitors}`);
        broadcastVisitors();
    });
});

init().then(() => {
    server.listen(HOST_PORT, HOST_IP, () => {
        console.log('Secure WebSocket server is running on wss://[::]:30000');
    })
});
