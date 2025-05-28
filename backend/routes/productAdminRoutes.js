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

router.post("/", protect, admin, async (req, res) => {
  try {
    console.log("Creating new product:", req.body);
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
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

    // Validate required fields
    if (!name || !description || !price || !category) {
      console.error("Missing required fields:", { name, description, price, category });
      return res.status(400).json({ 
        message: "Missing required fields", 
        required: { name, description, price, category } 
      });
    }

    // Convert string arrays to actual arrays if needed
    const processedSizes = typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes;
    const processedColors = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors;
    const processedImages = typeof images === 'string' ? images.split(',').map(url => ({ url: url.trim() })) : images;

    const product = new Product({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      countInStock: countInStock ? Number(countInStock) : 0,
      category,
      brand: brand ? brand.trim() : "",
      sizes: processedSizes,
      colors: processedColors,
      collection,
      material,
      gender: gender || "Unisex",
      images: processedImages,
      isFeatured: isFeatured || false,
      isPublished: isPublished || false,
      tag: tag ? (typeof tag === 'string' ? tag.split(',').map(t => t.trim()) : tag) : [],
      dimension: dimension || {},
      weight: weight ? Number(weight) : undefined,
      sku,
      user: req.user._id,
    });

    console.log("Attempting to save product:", product);
    const createdProduct = await product.save();
    console.log("Product created successfully:", createdProduct._id);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors
    });
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message,
      details: error.errors || error.stack
    });
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
      colors,
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

    // Convert string arrays to actual arrays if needed
    const processedSizes = typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes;
    const processedColors = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors;
    const processedImages = typeof images === 'string' ? images.split(',').map(url => ({ url: url.trim() })) : images;

    // Update only the fields that are provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (countInStock !== undefined) product.countInStock = Number(countInStock);
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (sizes !== undefined) product.sizes = processedSizes;
    if (colors !== undefined) product.colors = processedColors;
    if (collection !== undefined) product.collection = collection;
    if (material !== undefined) product.material = material;
    if (gender !== undefined) product.gender = gender;
    if (images !== undefined) product.images = processedImages;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isPublished !== undefined) product.isPublished = isPublished;
    if (tag !== undefined) product.tag = tag ? (typeof tag === 'string' ? tag.split(',').map(t => t.trim()) : tag) : [];
    if (dimension !== undefined) product.dimension = dimension;
    if (weight !== undefined) product.weight = weight ? Number(weight) : undefined;
    if (sku !== undefined) product.sku = sku;

    console.log("Saving updated product:", product);
    const updatedProduct = await product.save();
    console.log("Product updated successfully:", updatedProduct._id);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors
    });
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message,
      details: error.errors || error.stack
    });
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
  