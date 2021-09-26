const nodemailer = require('nodemailer');

const sendMail = (email, subject, content) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.cannademia.online",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'mailing@cannademia.online', // generated ethereal user
            pass: 'Cannademius420' // generated ethereal password
        }
    });

    let mailOptions = {
        from: '"Cannademia" <mailing@cannademia.online>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: "Hello world?", // plain text body
        html: content // html body
    };
    transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error)
                //callback(error);
        }
        console.log(response);
    });
}

module.exports = { sendMail };