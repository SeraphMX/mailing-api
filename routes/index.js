const express = require('express');

const app = express();


app.use(require('./login'));
app.use(require('./users'));
app.use(require('./sms'));
app.use(require('./mailing'));
app.use(require('./layout'));
app.use(require('./admin'));

module.exports = app;