const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs');
const { sendMail } = require('./sendMail');

const db = require('../config/db');

const app = express();


app.post('/courses/get', (req, res) => {

    let connection = db.connect();

    connection.query(`CALL coursesGet()`, (err, rows) => {
        connection.end(function(err) {
            // The connection is terminated now
        });
        if (err) {
            return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
        }

        return res.json(rows);
    });


});