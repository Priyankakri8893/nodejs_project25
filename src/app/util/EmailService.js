// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: "priyankakridemo93@gmail.com",
//     pass: "ozwb zicp cbny bpqx",
//   },
// });

// exports.emailOtp = async (email, smsBody, otp) => {
//   try {
//     const info = await transporter.sendMail({
//       from: '"node_js 👌" <priyankakridemo93@gmail.com>', // sender address
//       to: email, // "bar@example.com, baz@example.com", // list of receivers
//       subject: "Otp for email verification", // Subject line
//       text: smsBody, // plain text body
//       html: `<!DOCTYPE html>
// <html>
// <head>
//     <title>OTP Verification</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             background-color: #f4f4f4;
//             padding: 20px;
//             text-align: center;
//         }
//         .container {
//             background: #fff;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
//             max-width: 400px;
//             margin: auto;
//         }
//         .otp {
//             font-size: 24px;
//             font-weight: bold;
//             color: #333;
//             background: #f3f3f3;
//             padding: 10px;
//             border-radius: 5px;
//             display: inline-block;
//             margin: 10px 0;
//         }
//         .footer {
//             margin-top: 20px;
//             font-size: 12px;
//             color: #777;
//         }
//     </style>
// </head>
// <body>

//     <div class="container">
//         <h2>OTP Verification</h2>
//         <p>${smsBody}</p>
//         <div class="otp">${otp}</div>
//         <p>Please use this OTP to complete your verification. It will expire in 10 minutes.</p>
//         <p>If you did not request this, please ignore this email.</p>
//         <div class="footer">Thank you!</div>
//     </div>

// </body>
// </html>
// `,
//     });

//     console.log("Message sent: %s", info.messageId);
//     return "ok";
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const nodemailer = require("nodemailer");

class EmailService {
  constructor(smtpConfig = null) {
    // Default Gmail SMTP settings if no configuration is passed
    this.smtpConfig = smtpConfig || {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "priyankakridemo93@gmail.com",  // Add your email here or in environment variables
        pass: "ozwb zicp cbny bpqx",  // Add your email password here or in environment variables
      },
    };

    // Create the transporter with the provided or default configuration
    this.transporter = nodemailer.createTransport(this.smtpConfig);
  }

  // Method to send OTP email
  async emailOtp(email, smsBody, otp) {
    try {
      const info = await this.transporter.sendMail({
        from: '"OTP Service" <no-reply@example.com>', // sender address (You can change the sender)
        to: email, // list of receivers
        subject: "Otp for email verification", // Subject line
        text: smsBody, // plain text body
        html: `<!DOCTYPE html>
<html>
<head>
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            margin: auto;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            background: #f3f3f3;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>OTP Verification</h2>
        <p>${smsBody}</p>
        <div class="otp">${otp}</div>
        <p>Please use this OTP to complete your verification. It will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">Thank you!</div>
    </div>

</body>
</html>
`,
      });

      console.log("Message sent: %s", info.messageId);
      return "ok";
    } catch (error) {
      console.log("Error:", error.message);
      throw new Error("Error sending OTP email");
    }
  }
}

module.exports = EmailService;
