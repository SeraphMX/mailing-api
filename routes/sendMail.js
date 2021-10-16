const nodemailer = require('nodemailer');

const sendMail = (company, sender, email, subject, content) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "localhost",
        port: process.env.EMAILPORT
        // secure: true, // true for 465, false for other ports
        // auth: {
        //     user: sender, // generated ethereal user
        //     pass: pass // generated ethereal password
        // }
    });

    let mailOptions = {
        from: ` "${company}" <${sender}> `, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: "Hello world?", // plain text body
        html: content // html body
    };
    transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error)
                //callback(error);
        }else{
            console.log('Email enviado: ' + info.response);
        }
        console.log(response);
    });



    
}

module.exports = { sendMail };

let resp=false;


