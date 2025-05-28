const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/Authmiddleware");
const router = express.Router();






router.get("/new-arrival", async (req, res) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);
    
    if (newArrivals) {
      res.status(200).json(newArrivals);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.find({})
      .sort({ rating: -1 })
      .limit(4);
    
    if (bestSellers) {
      res.status(200).json(bestSellers);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



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
      brand: brand ? brand.trim() : "",
      sizes,
      colors: color,
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

    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand ? brand.trim() : product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = color || product.colors;
      product.collection = collection || product.collection;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
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
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};
    if (collection && collection.toLowerCase() !== "all") {
      query.collection = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",").map(m => new RegExp(`^${m.trim()}$`, 'i')) };
    }

    if (brand) {
      query.brand = { $in: brand.split(",").map(b => new RegExp(`^${b.trim()}$`, 'i')) };
    }

    if (size) {
      query.sizes = { $in: size.split(",").map(s => new RegExp(`^${s.trim()}$`, 'i')) };
    }

    if (color) {
      query.colors = { $in: color.split(",").map(c => new RegExp(`^${c.trim()}$`, 'i')) };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        case "createdAt":
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
          break;
      }
    } else {
      sort = { createdAt: -1 };
    }

    const limitNumber = limit ? Number(limit) : 20;
    const products = await Product.find(query).sort(sort).limit(limitNumber);
    
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      collections: product.collections,
    }).limit(4);

    return res.status(200).json(similarProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});






router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
