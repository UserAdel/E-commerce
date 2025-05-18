const express = require("express");
const product = require("../models/Product");
const { protect, admin } = require("../middleware/Authmiddleware");
const router = express.Router();


router.get("/", protect, admin, async (req, res) => {
    try {
      const products = await product.find({});
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  module.exports = router;
  