const transporter = require("../utils/mailer");

const sendTestEmail = async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "DecisionDeck SMTP Test",
      text: "This is a test email from DecisionDeck using Nodemailer and Gmail SMTP.",
    });

    console.log("Test email sent:", info.messageId);

    res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test email error:", error);

    res.status(500).json({
      message: "Failed to send test email",
    });
  }
};

module.exports = {
  sendTestEmail,
};