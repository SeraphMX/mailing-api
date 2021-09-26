const express = require('express');
const mysql = require('mysql');
const db = require('../config/db');

// const bodyParser = require('body-parser');
const app = express();

app.get('/layout/aside/:id', (req, res) => {
	let connection = db.connect();

	if (!req.params.id) {
		res.json({
			status: 'Error',
			message: 'Parametro requerido.',
		});
	} else {
		connection.query(
			`CALL getMenuElements("${req.params.id}")`,
			(err, rows) => {
				connection.end(function (err) {
					// The connection is terminated now
				});
				if (err) {
					return res.json({ error: true, message: 'Error occurred' + err });
				}

				//connection will be released as well.
				return res.json({ items: rows[0] });
			}
		);
	}
});

app.get('/layout/topbar/:module', (req, res) => {
	let connection = db.connect();

	if (!req.params.module) {
		res.json({
			status: 'Error',
			message: 'Parametro requerido',
		});
	} else {
		connection.query(`CALL ("${req.params}")`, (err, rows) => {
			connection.end(function (err) {
				// The connection is terminated now
			});
			if (err) {
				return res.json({ error: true, message: 'Error occurred' + err });
			}

			//connection will be released as well.
			return res.json(rows);
		});
	}
});

module.exports = app;
