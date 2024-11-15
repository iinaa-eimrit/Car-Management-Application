const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      default: "SKU",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    quantity: {
      type: Number, // Quantity should likely be a number
      required: [true, "Please add a quantity"],
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number, // Price should likely be a number
      required: [true, "Please add a price"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    image: {
      type: Object, // Storing an object for the image, such as URL, public_id, etc.
      default: {},
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
