const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/Authmiddleware");

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
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
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
      const newCart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
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

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, userid, guestId } = req.body;

  try {
    let cart = await getCart(userid, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      cart.totalPrice = cart.products.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/", async (req, res) => {
  const { productId, size, color, userid, guestId } = req.body;

  try {
    let cart = await getCart(userid, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "Guest cart is empty" });
      }

      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0);
        await userCart.save();


      try {
        await Cart.findByIdAndDelete({guestId});

      } catch (error) {
        console.error("error deleting guest cart",error);
        
      }
        return res.status(200).json(userCart);
      } else {
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        return res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
      return res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});










router.get("/", async (req, res) => {
  const { userid, guestId } = req.query;
  try {
    const cart = await getCart(userid, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
