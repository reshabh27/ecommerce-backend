const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // create a transporter
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // define email options 
    const emailOptions = {
        from: 'ecommerce support<support@ecommerce.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    await transport.sendMail(emailOptions);
}


module.exports = sendEmail;