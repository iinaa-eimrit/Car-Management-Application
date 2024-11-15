const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies or Authorization header
  token = req.cookies.token || req.headers.authorization?.startsWith("Bearer ") 
    ? req.headers.authorization.split(" ")[1] 
    : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found or no longer exists");
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw new Error("Not authorized, please login");
  }
});

module.exports = protect;