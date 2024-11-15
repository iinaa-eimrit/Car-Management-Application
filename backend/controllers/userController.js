const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Generate Token with additional security measures
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: "1d",
    algorithm: 'HS256' // Explicitly specify the algorithm
  });
};

// Set secure cookie options
const getCookieOptions = (expires = new Date(Date.now() + 24 * 60 * 60 * 1000)) => ({
  path: "/",
  httpOnly: true,
  expires,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  domain: process.env.COOKIE_DOMAIN || undefined
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Enhanced validation
  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  // Enhanced password validation
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long");
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
  }

  // Check if user email already exists - case insensitive
  const userExists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create new user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, getCookieOptions());

  // Return user data without sensitive information
  const { _id, photo, phone, bio } = user;
  res.status(201).json({
    _id,
    name: user.name,
    email: user.email,
    photo,
    phone,
    bio,
  });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email?.trim() || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Check if user exists - case insensitive
  const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, getCookieOptions());

  // Return user data without sensitive information
  const { _id, name, photo, phone, bio } = user;
  res.status(200).json({
    _id,
    name,
    email: user.email,
    photo,
    phone,
    bio,
  });
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", getCookieOptions(new Date(0)));
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  try {
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);
  } catch (error) {
    return res.json(false);
  }
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Validate email if it's being updated
  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      res.status(400);
      throw new Error("Please provide a valid email address");
    }

    // Check if new email already exists
    const emailExists = await User.findOne({ 
      email: { $regex: new RegExp(`^${req.body.email}$`, 'i') },
      _id: { $ne: user._id }
    });

    if (emailExists) {
      res.status(400);
      throw new Error("Email already exists");
    }
  }

  // Update user fields
  const fieldsToUpdate = {
    name: req.body.name?.trim() || user.name,
    email: req.body.email?.toLowerCase().trim() || user.email,
    phone: req.body.phone?.trim() || user.phone,
    bio: req.body.bio?.trim() || user.bio,
    photo: req.body.photo || user.photo,
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    fieldsToUpdate,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json(updatedUser);
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Validate inputs
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please provide both old and new password");
  }

  // Validate new password
  if (password.length < 8) {
    res.status(400);
    throw new Error("New password must be at least 8 characters long");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
  }

  // Check if old password matches
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!passwordIsCorrect) {
    res.status(401);
    throw new Error("Old password is incorrect");
  }

  // Ensure new password is different from old password
  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    res.status(400);
    throw new Error("New password must be different from old password");
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete existing tokens for this user
  await Token.deleteMany({ userId: user._id });

  // Create Reset Token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await Token.create({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
  });

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
    <h2>Hello ${user.name}</h2>
    <p>You requested a password reset. Please use the link below to reset your password.</p>
    <p>This reset link is valid for only 30 minutes.</p>
    <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
    <p>If you didn't request this reset, please ignore this email.</p>
    <p>Regards,</p>
    <p>${process.env.SITE_NAME || 'Support Team'}</p>
  `;

  try {
    await sendEmail({
      subject: "Password Reset Request",
      message,
      send_to: user.email,
      sent_from: process.env.EMAIL_USER,
      reply_to: process.env.EMAIL_USER
    });

    res.status(200).json({ 
      success: true, 
      message: "Password reset email sent" 
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email could not be sent, please try again later");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Validate new password
  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
  }

  // Hash token for comparison
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find valid token
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() }
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired reset token");
  }

  // Find and update user
  const user = await User.findById(userToken.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Ensure new password is different from old password
  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    res.status(400);
    throw new Error("New password must be different from old password");
  }

  user.password = password;
  await user.save();

  // Delete used token
  await Token.deleteOne({ _id: userToken._id });

  res.status(200).json({
    message: "Password reset successful. Please login with your new password",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};