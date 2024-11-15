const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads";
    
    // Ensure the 'uploads' folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // destination folder
  },
  filename: function (req, file, cb) {
    // Creating a unique filename using current timestamp and original filename
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// Specify file format that can be saved
function fileFilter(req, file, cb) {
  const validMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed"), false);
  }
}

const upload = multer({ storage, fileFilter });

// File Size Formatter
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

module.exports = { upload, fileSizeFormatter };
