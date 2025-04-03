const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/Authmiddleware");
const router = express.Router();

router.post("/", protect, admin, async (req, res) => {
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

router.put("/:id", protect, admin, async (req, res) => {

  
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

    const product= await Product.findById(req.params.id);
    if (product) {

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.countInStock = countInStock || product.countInStock;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes = sizes || product.sizes;
        product.color = color || product.color;
        product.collection = collection || product.collection;
        product.material = material || product.material;
        product.gender = gender || product.gender;
        product.images = images || product.images;
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
        product.tag = tag || product.tag;
        product.dimension = dimension || product.dimension;
        product.weight = weight || product.weight;
        product.sku = sku || product.sku;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
          } else {
        res.status(404).json({ message: "Product not found" });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
      }

});

router.delete(":id", protect, admin, async (req, res) => {
  const product= await Product.findById(req.params.id);
  if (product) {
    await product.remove();
   res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }


});








module.exports = router;
