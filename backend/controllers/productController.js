const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  // Image Upload
  let fileData = {};
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "PinventApp",
        resource_type: "image",
      });
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      res.status(500);
      throw new Error("Image upload failed.");
    }
  }

  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Product not found or access denied.");
  }
  res.status(200).json(product);
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Product not found or access denied.");
  }
  await product.deleteOne();
  res.status(200).json({ message: "Product deleted successfully." });
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price, description } = req.body;

  const product = await Product.findById(id);
  if (!product || product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Product not found or access denied.");
  }

  // Handle Image Upload
  let fileData = {};
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "PinventApp",
        resource_type: "image",
      });
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      res.status(500);
      throw new Error("Image upload failed.");
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length ? fileData : product.image,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
