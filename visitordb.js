require ('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');




const PORT = process.env.HOST_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});

const app = express();

app.get('/visitors/get', async (req, res) => {
	try {
		const connection = await pool.getConnection();

		const sql = `SELECT visitorcounter FROM visitors`;
		const [rows] = await connection.execute(sql);

		connection.release();

		const visitorcounter = rows[0].visitorcounter; 

		res.json({ visitorcounter }); 

	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching visitor counter!');
	}
});

app.get('/visitors/set/:amount', async (req, res) => {
	try {
        const amount = req.params.amount;
		const connection = await pool.getConnection();

        let sql = "UPDATE `visitors` SET `visitorcounter`=? WHERE 1";
		const [rows] = await connection.execute(sql, [amount]);

		connection.release();

		res.json({ amount }); 

	} catch (error) {
		console.error(error);
		res.status(500).send('Error setting visitor counter!');
	}
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));