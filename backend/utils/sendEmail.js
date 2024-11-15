const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  try {
    // Create Email Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Options for sending email
    const options = {
      from: sent_from,
      to: send_to,
      replyTo: reply_to,
      subject: subject,
      html: message,
    };

    // Send email and await result
    const info = await transporter.sendMail(options);

    // Return email send result (can be handled elsewhere)
    return info;
  } catch (err) {
    // Log the error and rethrow it
    console.error("Error sending email:", err);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
