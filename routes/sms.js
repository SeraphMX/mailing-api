const express = require('express');

// Configuración de twilio para enviar mensaje sms
const accountSid = 'AC68967d6288a394ec5373986c2828fe47';
const authToken = '3cc53dc05c08f7e670b53de29c4f7f5d';
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const app = express();

app.post('/sms', (req, res) => {

    console.log(req.body);

    let phone = req.body.phone,
        sms = req.body.sms;

    if (!phone || !sms) {
        res.json({
            status: 'Error',
            message: 'Todos los parametros deben ser llenados.'
        });
    } else {
        client.messages.create({
                from: '+15005550006',
                body: sms,
                to: `+52${phone}`
            })
            .then((message) => {

                console.log(message.sid);

                if (message.sid) {
                    res.json({
                        status: 200,
                        message: 'El SMS a sido enviando exitosamente.'
                    });
                }

            })
            .catch(() => {

                res.json({
                    status: 400,
                    message: 'Error al enviar el SMS.'
                });

            });
    }

});

module.exports = app;