const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs');
const { sendMail } = require('./sendMail');

const db = require('../config/db');

const app = express();

app.get('/folderTest', (req, res) => {

    console.log("Welcome");
    return res.json({
        status: 'OK',
        directoryBase: __dirname
    });



})

app.post('/admin/users/add', (req, res) => {

    console.log(req.body);

    let connection = db.connect(),
        pMail = req.body.email,
        pName = req.body.name,
        pPhone = req.body.phone;

    if (!pMail || !pName || !pPhone) {
        res.json({
            status: 'Error',
            message: 'Los parametros son requeridos'
        });
    } else {
        connection.query(`CALL admin_userCreate("${pMail}", "${pName}", "${pPhone}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
            }

            const statusCode = rows[0][0].statusCode;

            if (statusCode === 200) {

                let readHTMLFile = (path, callback) => {
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
                        name: pName
                    };

                    let htmlToSend = template(replacements);

                    sendMail('seraph.axl@gmail.com', 'Bienvenido a Cannademia', htmlToSend);

                });
            }

            return res.json(rows);

        });
    }

});

app.post('/admin/courses/add', (req, res) => {

    console.log(req.body);

    let connection = db.connect(),
        pName = req.body.name,
        pShortDescription = req.body.shortDescription;

    if (!pName || !pShortDescription) {
        res.json({
            status: 'Error',
            message: 'Los parametros son requeridos.'
        });
    } else {
        connection.query(`CALL admin_courseAdd("${pName}", "${pShortDescription}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });

            if (err) {
                return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
            }

            return res.json(rows);
        });
    }

});

app.post('/admin/courses/all', (req, res) => {

    let connection = db.connect();

    connection.query(`CALL admin_coursesGet()`, (err, rows) => {
        connection.end(function(err) {
            // The connection is terminated now
        });
        if (err) {
            return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
        }

        return res.json(rows);
    });

});

app.post('/admin/workshops/add', (req, res) => {

    console.log(req.body);

    let connection = db.connect(),
        pName = req.body.name,
        pInstructor = req.body.instructor,
        pShortDescription = req.body.shortDescription,
        pDate = req.body.date,
        pTime = req.body.time;

    if (!pName || !pInstructor || !pShortDescription || !pDate || !pTime) {
        res.json({
            status: 'Error',
            message: 'Los parametros son requeridos.'
        });
    } else {
        connection.query(`CALL admin_workshopAdd("${pName}", "${pInstructor}", "${pShortDescription}", "${pDate}", "${pTime}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
            }

            return res.json(rows);
        });
    }

});

app.post('/admin/workshops/all', (req, res) => {

    let connection = db.connect();

    connection.query(`CALL admin_workshopsGet()`, (err, rows) => {
        connection.end(function(err) {
            // The connection is terminated now
        });
        if (err) {
            return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
        }

        return res.json(rows);
    });

});

app.post('/admin/workshops/get-registered', (req, res) => {

    let connection = db.connect(),
        pWorkshop = req.body.workshop;


    if (!pWorkshop) {
        res.json({
            status: 'Error',
            message: 'Los parametros son requeridos.'
        });
    } else {
        connection.query(`CALL admin_workshopsRegisteredUsers("${pWorkshop}")`, (err, rows) => {
            connection.end(function(err) {
                // The connection is terminated now
            });
            if (err) {
                return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
            }

            return res.json(rows);
        });
    }






});

app.post('/admin/sendmail', (req, res) => {

    let email = req.body.email,
        asunto = req.body.asunto,
        mensaje = req.body.mensaje;

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

    readHTMLFile(__dirname + '/../public/mailing/mail-cannademia.html', function(err, data) {

        let template = handlebars.compile(data);
        let replacements = {
            mensaje: mensaje
        };

        let htmlToSend = template(replacements);

        sendMail(email, asunto, htmlToSend);

        return res.json({
            status: 200,
            message: 'Correo enviado.'
        });

    });

});

module.exports = app;