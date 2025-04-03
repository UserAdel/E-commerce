const express = require("express");
const Product = require("../models/Product"); // Changed from User to Product
const { protect } = require("../middleware/Authmiddleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      color, 
      collection, 
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tag, 
      dimension, 
      weight,
      sku,
    } = req.body;


    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      color,
      collection,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tag,
      dimension,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
