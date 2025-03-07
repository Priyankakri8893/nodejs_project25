const nodemailer = require("nodemailer");
class EmailService {
  constructor() {
    this.smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "priyankakridemo93@gmail.com",
        pass: "ozwb zicp cbny bpqx",
      },
    };

    this.transporter = nodemailer.createTransport(this.smtpConfig);
  }

  async emailOtp(email, smsBody, otp) {
    try {
      const info = await this.transporter.sendMail({
        from: '"OTP Service" <no-reply@example.com>',
        to: email,
        subject: "Otp for email verification",
        text: smsBody,
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
