const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // Changed from lowercase - avoid variable name conflicts
const { protect } = require("../middleware/Authmiddleware"); // Added destructuring and fixed path

const router = express.Router();

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

router.post("/", protect, async (req, res) => {
  const { productId, quantity, size, color, guestId } = req.body;
  const userId = req.user ? req.user._id : null;

  try {
    // Don't reuse variable names from imports
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCart(userId, guestId);
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );
      if(productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url, // Fixed: images is array
          price: product.price,
          size,
          color,
          quantity,
        });
      }
      cart.totalPrice = cart.products.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Fixed: Don't use 'new' with a method call, and fix string concatenation
      const newCart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || ("guest_" + new Date().getTime()),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url, // Fixed: images is array
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      res.status(201).json(newCart);
    }
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
