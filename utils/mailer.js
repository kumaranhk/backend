import nodemailer from "nodemailer";
import constants from "../constants/constants.js";

const emailID = constants.mail;
const password = constants.mailPass;

const sendMail = ({ name, email, link, type }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailID,
      pass: password,
    },
  });
  // console.log(name, email, link, type);
  const registration = {
    subject: "Password creatiion",
    content: "Welcome, Please click here to set your password",
  };
  const passwordReset = {
    subject: "Password Reset",
    content:
      "We received a request to reset your password. Click the button below to reset it.",
  };
  const mailOptions = {
    from: emailID,
    to: [email],
    subject:
      type == "registration" ? registration.subject : registration.subject,
    // text: "That was easy!",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${
          type == "registration" ? registration.subject : passwordReset.subject
        }</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px solid #dddddd;
            }
            .header h1 {
                margin: 0;
                color: #333333;
            }
            .content {
                padding: 20px;
                text-align: left;
            }
            .content p {
                margin: 10px 0;
                color: #555555;
            }
            .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px 0;
                background-color: #007bff;
                color: #ffffff;
                text-align: center;
                border-radius: 5px;
                text-decoration: none;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                border-top: 1px solid #dddddd;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hi ${name},</p>
                <p>${
                  type == "registration"
                    ? registration.content
                    : passwordReset.content
                }</p>
                <a href=${link} class="button">Reset Password</a>
                <p>If you did not raised this request, please ignore this email or contact support if you have questions.</p>
                <p>Thank you,<br>The Batman </p>
            </div>
            <div class="footer">
                <p>&copy; All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export { sendMail };
