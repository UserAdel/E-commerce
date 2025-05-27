const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/Authmiddleware");
const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
  try {
    console.log("Fetching all products...");
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    console.log("First product sample:", products[0]);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    console.log("Updating product:", req.params.id);
    console.log("Update data:", req.body);
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

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

    // Update only the fields that are provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (sizes !== undefined) product.sizes = sizes;
    if (color !== undefined) product.color = color;
    if (collection !== undefined) product.collection = collection;
    if (material !== undefined) product.material = material;
    if (gender !== undefined) product.gender = gender;
    if (images !== undefined) product.images = images;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isPublished !== undefined) product.isPublished = isPublished;
    if (tag !== undefined) product.tag = tag;
    if (dimension !== undefined) product.dimension = dimension;
    if (weight !== undefined) product.weight = weight;
    if (sku !== undefined) product.sku = sku;

    const updatedProduct = await product.save();
    console.log("Product updated successfully:", updatedProduct._id);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    console.log("Deleting product:", req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    console.log("Product deleted successfully:", req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
  