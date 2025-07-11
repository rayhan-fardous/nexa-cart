const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");

// Add a new manager
exports.addManager = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let manager = await User.findOne({ email });
    if (manager) {
      return res
        .status(400)
        .json({ message: "Manager with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    manager = new User({
      name,
      email,
      password: hashedPassword,
      role: "manager",
    });
    await manager.save();

    res.status(201).json({ message: "Manager created successfully", manager });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all managers
exports.getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" }).select("-password");
    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a manager
exports.deleteManager = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Manager deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// View all products
exports.viewAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("managedBy", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
