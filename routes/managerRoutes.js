const express = require("express");
const router = express.Router();
const {
  addProduct,
  editProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/managerController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Protect all routes below and authorize only for 'manager' role
router.use(protect, authorize("manager"));

router.post("/products", addProduct);
router.get("/products", getMyProducts);
router.put("/products/:id", editProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
