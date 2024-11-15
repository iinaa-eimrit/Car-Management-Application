const express = require("express");
const { contactUs } = require("../controllers/contactController");  // No change needed here
const router = express.Router();
const protect = require("../middleWare/authMiddleware");  // Corrected the path to 'middleware'

router.post("/", protect, contactUs);

module.exports = router;
