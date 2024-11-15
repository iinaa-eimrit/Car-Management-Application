const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;

  // Fetch user details
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found. Please signup.");
  }

  // Validation
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please provide both subject and message.");
  }

  const sendTo = process.env.EMAIL_USER;
  const sentFrom = process.env.EMAIL_USER;
  const replyTo = user.email;

  try {
    await sendEmail(subject, message, sendTo, sentFrom, replyTo);
    res.status(200).json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent. Please try again.");
  }
});

module.exports = {
  contactUs,
};
