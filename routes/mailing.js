const express = require('express');
const mysql = require('mysql2');
const handlebars = require('handlebars');
const { sendMail } = require('./sendMail');
var fs = require('fs');

const db = require('../config/db');

const feedParser = require('feedparser');
const request = require('request');
const stream = require('stream');

const FeedParser = require('feedparser');
const fetch = require('node-fetch'); // for fetching the feed

// const bodyParser = require('body-parser');
const app = express();

// pool.connect((err) => {
//   if (err) throw err;
// });


// Envia una prueba de correo electrónico
app.post('/mail/sendTest', (req, res) => {
	let company = req.body.company,
        sender = req.body.sender,
        utmcampaign = req.body.utmcampaign,
		email = req.body.email,
		subject = req.body.subject ;


		if (!utmcampaign || !email) {
			return res.json({
				status: 'Error',
				message: 'Los parametros son requeridos.'
			});
		} else {

			var readHTMLFile = (path, callback) => {
				fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
					if (err) {
						throw err;
						callback(err);
					} else {
						callback(null, html);
					}
				});
			};

			//TODO:Sender
		
			readHTMLFile(__dirname + `/../public/mailing/${company}/${utmcampaign}.html`, (err, html) => {
				sendMail(company, sender, email, subject, html);
			});

			return res.json({
				status: 'ok',
			});
		}	
});

app.post('/mailing/suscribe', (req, res) => {

	let connection = db.connect();

	if (!req.body.email) {
		res.json({
			status: 'Error',
			message: 'Los campos son requeridos.',
		});
	} else {
		connection.query(`CALL mailAdd("${req.body.email}")`, (err, rows) => {
			connection.end(function (err) {
				// The connection is terminated now
			});
			if (err) {
				console.log('Error occurred' + err);
			}

			var readHTMLFile = (path, callback) => {
				fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
					if (err) {
						throw err;
						callback(err);
					} else {
						callback(null, html);
					}
				});
			};

			readHTMLFile(
				__dirname + '/../public/mailing/boletin.html',
				(err, html) => {
					let template = handlebars.compile(html);
					let replacements = {
						email: req.body.email,
					};

					let htmlToSend = template(replacements);
					sendMail(req.body.email, 'Bienvenido al boletín', htmlToSend);
				}
			);
		});

		return res.json({
			status: 'Mensaje enviado... esperando respuesta del servidor.',
		});
	}
});

app.post('/mailing/unsuscribe', (req, res) => {

	let connection = db.connect();

	if (!req.body.email) {
		res.json({
			status: 'Error',
			message: 'Los campos son requeridos.',
		});
	} else {
		connection.query(`CALL mailAdd("${req.body.email}")`, (err, rows) => {
			connection.end(function (err) {
				// The connection is terminated now
			});
			if (err) {
				console.log('Error occurred' + err);
			}

			var readHTMLFile = (path, callback) => {
				fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
					if (err) {
						throw err;
						callback(err);
					} else {
						callback(null, html);
					}
				});
			};

			readHTMLFile(
				__dirname + '/../public/mailing/boletin.html',
				(err, html) => {
					let template = handlebars.compile(html);
					let replacements = {
						email: req.body.email,
					};

					let htmlToSend = template(replacements);
					sendMail(req.body.email, 'Bienvenido al boletín', htmlToSend);
				}
			);
		});

		return res.json({
			status: 'Mensaje enviado... esperando respuesta del servidor.',
		});
	}
});


app.post('/mailing/setMailSending', (req, res) => {
    let connection = db.connect(),
        company = req.body.company,
		sender = req.body.sender,
        utmcampaign = req.body.utmcampaign,
		subject = req.body.subject ;
		limit = req.body.limit;	


		var readHTMLFile = (path, callback) => {
			fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
				if (err) {
					throw err;
					callback(err);
				} else {
					callback(null, html);
				}
			});
		};


    if (!utmcampaign || !limit) {
        res.json({
            status: 'Error',
            message: 'Los parametros son requeridos.'
        });
    } else {
		console.log("<--------------------->")
        connection.query(`CALL setMailsPrestamagico("${process.env.SERVERCODE}", "${company}","${utmcampaign}", ${limit}, "api")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
            }

			var counter = 0
			//console.log(rows)
			Object.keys(rows[0]).forEach(key => {
			//console.log(counter)
			//counter ++

			//console.log("Key"+ key)

			var row = rows[0][key];
			console.log(row.email);			

			
			readHTMLFile(__dirname + `/../public/mailing/${company}/${utmcampaign}.html`, (err, html) => {
				sendMail(company, sender, row.email, subject, html);
			});


			});

            return res.json(rows);
        });
    }

});


app.post('/mailing/taller', (req, res) => {
	//let connection = db.connect();

	if (!req.body.email) {
		res.json({
			status: 'Error',
			message: 'Los campos son requeridos.',
		});
	} else {
		var readHTMLFile = (path, callback) => {
			fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
				if (err) {
					throw err;
					callback(err);
				} else {
					callback(null, html);
				}
			});
		};

		readHTMLFile(__dirname + '/../public/mailing/taller.html', (err, html) => {
			let template = handlebars.compile(html);
			let replacements = {
				email: req.body.email,
			};

			let htmlToSend = template(replacements);
			sendMail(req.body.email, 'No te lo pierdas, accede hoy al taller', html);

			// res.write(htmlToSend);
			// res.end();
		});

		return res.json({
			statusCode: 200,
			msg: `Mensaje enviado a ${req.body.email}`,
		});
	}
});

app.post('/mailing/send', (req, res) => {
	//let connection = db.connect();

	if (!req.body.workshop) {
		res.json({
			status: 'Error',
			message: 'Los campos son requeridos.',
		});
	} else {
		connection.query(
			`CALL workshopRegister("${req.body.name}", "${req.body.email}", "${req.body.phone}", "${req.body.workshop}")`,
			(err, rows) => {
				connection.end(function (err) {
					// The connection is terminated now
				});
				if (err) {
					console.log('Error occurred' + err);
				}

				var readHTMLFile = (path, callback) => {
					fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
						if (err) {
							throw err;
							callback(err);
						} else {
							callback(null, html);
						}
					});
				};

				readHTMLFile(
					__dirname + '/../public/mailing/workshop-register.html',
					(err, html) => {
						let template = handlebars.compile(html);
						let replacements = {
							email: req.body.email,
							name: req.body.name,
						};

						let htmlToSend = template(replacements);
						sendMail(req.body.email, 'Tu inscripción al taller', htmlToSend);
					}
				);
			}
		);

		return res.json({
			statusCode: 200,
			msg: `Mensaje enviado a ${req.body.email}... esperando respuesta del servidor. `,
		});
	}
});


app.get('/mailing/feed', (req, res) => {
	var req = fetch('http://cannademia.online/feed');
	var feedparser = new FeedParser();
	var items = [];

	req.then(
		function (res) {
			if (res.status !== 200) {
				throw new Error('Bad status code');
			} else {
				// The response `body` -- res.body -- is a stream
				res.body.pipe(feedparser);
			}
		},
		function (err) {
			// handle any request errors
		}
	);

	feedparser.on('error', function (error) {
		// always handle errors
	});

	feedparser.on('readable', function () {
		// This is where the action is!
		var stream = this; // `this` is `feedparser`, which is a stream
		var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
		var item;

		while ((item = stream.read())) {
			console.log(item.title);
			items.push(item);
		}
	});

	feedparser.on('end', function (error) {
		console.log(items);

		var readHTMLFile = function (path, callback) {
			fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
				if (err) {
					throw err;
					callback(err);
				} else {
					callback(null, html);
				}
			});
		};

		res.writeHead(200, { 'Content-Type': 'text/html' });
		readHTMLFile(
			__dirname + '/../public/mailing/boletin-mensual.html',
			function (err, data) {
				let template = handlebars.compile(data);
				let replacements = {
					news: items,
				};

				let htmlToSend = template(replacements);

				sendMail('seraph.axl@gmail.com', 'Prueba', htmlToSend);

				res.write(htmlToSend);
				res.end();
			}
		);
	});
});

// Almacenar correos en la base de datos
app.post('/mail', (req, res) => {
	let connection = db.connect();

	if (!req.body.email) {
		res.json({
			status: 'Error',
			message: 'Faltan parametros',
		});
		console.log(req.body.email);
	} else {
		connection.query(`CALL mailAdd("${req.body.email}")`, (err, rows) => {
			connection.end(function (err) {
				// The connection is terminated now
			});
			if (err) {
				return res.json({ error: true, message: 'Error occurred' + err });
			}

			return res.json(rows);
		});
	}
});

// actualización del correo
app.put('/mail', (req, res) => {
	let connection = db.connect();

	if (!req.body.email || !req.body.status) {
		res.json({
			status: 'Error',
			message: 'Faltan parametros',
		});
	} else {
		connection.query(
			`CALL mailUpdate("${req.body.email}", ${req.body.status})`,
			(err, rows) => {
				connection.end(function (err) {
					// The connection is terminated now
				});
				if (err) {
					return res.json({ error: true, message: 'Error occurred' + err });
				}

				return res.json(rows);
			}
		);
	}
});



module.exports = app;
