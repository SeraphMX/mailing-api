const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
// const {tokenVerification} = require('../middlewares/authentication');

// const bodyParser = require('body-parser');
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.post('/login', (req, res) => {
	let connection = db.connect();

	if (!req.body.email || !req.body.password) {
		res.json({
			error: true,
			code: 501,
			message: 'Todos los campos son requeridos',
		});
	} else {
		connection.query(
			`CALL Login("${req.body.email}","${req.body.password}")`,
			(err, rows) => {
				connection.end(function (err) {
					// The connection is terminated now
				});

				if (err) {
					return res.json({ error: true, message: 'Error occurred' + err });
				}

				console.log(rows[0][0]);

				return res.json(rows[0][0]);
			}
		);
	}
});

module.exports = app;
