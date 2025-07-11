const Product = require("../models/Product");

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const product = new Product({
      name,
      description,
      price,
      managedBy: req.user.id, // Assign the logged-in manager
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a product
exports.editProduct = async (req, res) => {
  const { name, description, price, status } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the manager owns the product
    if (product.managedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, status },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.managedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await product.deleteOne(); // Use deleteOne() or remove()
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products managed by the logged-in manager
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ managedBy: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
