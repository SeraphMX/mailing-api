const express = require('express');
const fs = require('fs');

const db = require('../config/db');

const app = express();

app.get('/profile', (res, req) => {

  let connection = db.connect();

  connection.query('CALL profile_userGet()', (err, rows) => {
    if (err) {
      return res.json({ 'error': true, 'message': `Error ocurred ${err}` });
    }

    return res.json(rows);
  });

});