const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "in stock",
    },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This links the product to the manager (User) who created it
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
