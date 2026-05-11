const nodeMailer = require("nodemailer");
const constants = require("../../config/constants");

class Transporter {
    constructor() {

        if (constants.MAIL_SYSTEM === "nodemailer") {
            this.transporter = nodeMailer.createTransport({
                host: constants.MAIL_HOST,
                port: Number(constants.MAIL_PORT),
                // true only for 465
                secure: Number(constants.MAIL_PORT) === 465,
                auth: {
                    user: constants.MAIL_EMAIL,
                    pass: constants.MAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

        } else {
            // SendGrid SMTP
            this.transporter = nodeMailer.createTransport({
                host: "smtp.sendgrid.net",
                port: 587,
                secure: false,
                auth: {
                    user: "apikey",
                    pass: constants.MAIL_API_KEY
                }
            });

        }
    }

    async sendMail(mailOptions) {
        try {
            const info = this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId,
                response: info.response
            };
        } catch (error) {
            console.error("Mail Error:", error);
            //throw error;
        }
    }
}

module.exports = Transporter;
