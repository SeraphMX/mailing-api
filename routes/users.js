const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs');
const { sendMail } = require('./sendMail');

const db = require('../config/db');

// const bodyParser = require('body-parser');
const app = express();


// pool.connect((err) => {
//   if (err) throw err;
// });

app.post('/user', (req, res) => {

    let connection = db.connect();

    if (!req.body.email || !req.body.password) {
        res.json({
            status: 'Error',
            message: 'Los campos son requeridos.'
        });
    } else {

        connection.query(`CALL userCreate("${req.body.email}", "${req.body.password}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': 'Error occurred' + err });
            }

            //connection will be released as well.
            res.json(rows);
        });

    }

});

app.delete('/user', (req, res) => {

    let connection = db.connect();

    if (!req.body.id) {
        res.json({
            status: 'Error',
            message: 'Datos invalidos.'
        });
    } else {
        connection.query(`CALL userDelete(${req.body.id})`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': 'Error occurred' + err });
            }
            //connection will be released as well.
            return res.json(rows);
        });
    }

});

app.post('/beta/invite', (req, res) => {

    let connection = db.connect();

    if (!req.body.email) {
        res.json({
            status: 'Error',
            message: 'Los campos son requeridos.'
        });
    } else {
        connection.query(`CALL betaInvite("${req.body.email}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': 'Error occurred' + err });
            }
            //connection will be released as well.
            return res.json(rows);
        });
    }
});

app.post('/beta/invite/send', (req, res) => {

    var readHTMLFile = function(path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
            if (err) {
                throw err;
                callback(err);
            } else {
                callback(null, html);
            }
        });
    };

    res.writeHead(200, { 'Content-Type': 'text/html' });
    readHTMLFile(__dirname + '/../public/mailing/beta-register.html', function(err, data) {

        let template = handlebars.compile(data);
        let replacements = {
            name: "John Doe"
        };

        let htmlToSend = template(replacements);

        //sendMail('seraph.axl@gmail.com', 'Invitacion BETA', htmlToSend);

        res.write(htmlToSend);
        res.end();
    });

});


app.post('/beta/register', (req, res) => {


    let connection = db.connect();

    console.log(


        req.body
    )

    if (!req.body.email || !req.body.password) {
        res.json({
            status: 'Error',
            message: 'Los campos son requeridos.'
        });
    } else {

        connection.query(`CALL userCreate("${req.body.email}", "${req.body.password}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': 'Error occurred' + err });
            }

            //connection will be released as well.
            res.json(rows);
        });

    }

});




app.post('/user/passwordRetrieve', (req, res) => {

    let connection = db.connect();

    if (!req.body.email) {
        res.json({
            status: Error,
            message: 'Todos los campos son requeridos.'
        });
    } else {
        connection.query(`CALL passwordRetrieve("${req.body.email}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
            }

            if (rows[0][0].codeStatus) {

                var readHTMLFile = (path, callback) => {
                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        } else {
                            callback(null, html);
                        }
                    });
                };

                readHTMLFile(__dirname + '/../public/mailing/beta-register.html', function(err, data) {

                    let template = handlebars.compile(data);
                    let replacements = {
                        name: "John Doe"
                    };

                    let htmlToSend = template(replacements);

                    // sendMail('seraph.axl@gmail.com', 'Restaurar cuenta', htmlToSend);

                });
            }

            return res.json(rows);
        });
    }

});

app.post('/users/all', (req, res) => {

    let connection = db.connect();

    const obj = JSON.parse(JSON.stringify(req.body));

    console.log(obj);

    if (!obj['sort[field]']) {
        obj['sort[field]'] = 'Registered';
        obj['sort[sort]'] = 'desc';
    }

    if (!obj['query[generalSearch]']) {
        obj['query[generalSearch]'] = ' ';
    }

    console.log(obj['query[generalSearch]']);

    connection.query(`CALL usersGet(${obj['pagination[page]']},${obj['pagination[perpage]']},'${obj['sort[field]']}','${obj['sort[sort]']}', '${obj['query[generalSearch]']}')`, (err, rows) => {
        connection.end(function(err) {
            // The connection is terminated now
        });
        if (err) {
            return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
        }

        console.log(rows[0].length);

        let rTotal = 0;

        if (rows[0].length) {
            console.log(rows[0][0]['Total']);

            console.log(obj['pagination[total]']);

            if (obj['query[generalSearch]'] != ' ') {
                rTotal = rows[0].length;
            } else {
                rTotal = rows[0][0]['Total'];
            }
        }

        return res.json({
            "meta": {
                "page": obj['pagination[page]'],
                "pages": 35,
                "perpage": obj['pagination[perpage]'],
                "total": rTotal,
                "sort": "asc",
                "field": "UserStatus"
            },
            "data": rows[0]
        });
    });
});

module.exports = app;