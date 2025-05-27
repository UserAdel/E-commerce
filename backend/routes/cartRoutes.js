const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/Authmiddleware");

const router = express.Router();

// Middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: {
      authorization: req.headers.authorization ? "Bearer [HIDDEN]" : undefined,
      ...req.headers
    }
  });
  next();
});

const getCart = async (userId, guestId) => {
  console.log("Getting cart for:", { userId, guestId });
  
  try {
    let cart = null;
    if (userId) {
      // Try both user and userId fields
      cart = await Cart.findOne({ $or: [{ user: userId }, { userId: userId }] });
      console.log("User cart search result:", cart ? "Found" : "Not found");
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
      console.log("Guest cart search result:", cart ? "Found" : "Not found");
    }
    
    if (cart) {
      console.log("Cart found:", {
        id: cart._id,
        userId: cart.userId,
        user: cart.user,
        guestId: cart.guestId,
        productCount: cart.products.length
      });
    }
    
    return cart;
  } catch (error) {
    console.error("Error in getCart:", error);
    return null;
  }
};

// Allow both guest and authenticated users to add items to cart
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  console.log("Add to cart request received:", { 
    productId: productId?.toString(), 
    quantity, 
    size, 
    color, 
    userId: userId?.toString(), 
    guestId 
  });

  try {
    if (!productId || !quantity || !size || !color) {
      console.log("Missing required fields:", { productId, quantity, size, color });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCart(userId, guestId);
    if (cart) {
      console.log("Existing cart found, updating products");
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
      console.log("Cart updated successfully");
      return res.status(200).json(cart);
    } else {
      console.log("No existing cart found, creating new cart");
      const newCart = await Cart.create({
        userId: userId || undefined,
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
      console.log("New cart created:", {
        id: newCart._id,
        userId: newCart.userId,
        guestId: newCart.guestId,
        productCount: newCart.products.length
      });
      res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Allow both guest and authenticated users to update cart
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, userId, guestId } = req.body;
  console.log("Update cart request received:", { 
    productId: productId?.toString(), 
    quantity, 
    size, 
    color, 
    userId: userId?.toString(), 
    guestId 
  });

  try {
    // Validate request
    if (!productId || !quantity || !size || !color) {
      console.log("Missing required fields:", { productId, quantity, size, color });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user is authenticated when userId is provided
    if (userId && !req.headers.authorization) {
      console.log("Authentication required for user:", userId);
      return res.status(401).json({ message: "Authentication required for registered users" });
    }

    let cart = await getCart(userId, guestId);
    if (!cart) {
      console.log("Cart not found for:", { userId, guestId });
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log("Current cart products:", cart.products.map(p => ({
      productId: p.productId.toString(),
      size: p.size,
      color: p.color
    })));

    const productIndex = cart.products.findIndex((p) => {
      const productIdMatch = p.productId.toString() === productId.toString();
      const sizeMatch = p.size === size;
      const colorMatch = p.color === color;
      
      console.log("Comparing product:", {
        cartProductId: p.productId.toString(),
        requestProductId: productId.toString(),
        cartSize: p.size,
        requestSize: size,
        cartColor: p.color,
        requestColor: color,
        matches: { productIdMatch, sizeMatch, colorMatch }
      });
      
      return productIdMatch && sizeMatch && colorMatch;
    });

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      cart.totalPrice = cart.products.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      await cart.save();
      console.log("Cart updated successfully");
      return res.status(200).json(cart);
    } else {
      console.log("Product not found in cart. Requested product:", {
        productId: productId.toString(),
        size,
        color
      });
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Allow both guest and authenticated users to delete items from cart
router.delete("/", async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;
  console.log("Delete request received:", { productId, size, color, userId, guestId });

  try {
    // If no productId is provided, clear the entire cart
    if (!productId) {
      let cart = await getCart(userId, guestId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
      console.log("Cart cleared successfully");
      return res.status(200).json(cart);
    }

    // Otherwise, remove specific item
    let cart = await getCart(userId, guestId);
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
      console.log("Product removed successfully");
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error in delete cart route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Keep protect middleware for merge route as it requires authentication
router.post("/merge", protect, async (req, res) => {
  const { guestId, userId } = req.body;
  console.log("Merge request received:", { guestId, userId });

  try {
    const guestCart = await Cart.findOne({ guestId });
    console.log("Guest cart found:", guestCart ? "Yes" : "No");

    if (!guestCart) {
      console.log("No guest cart found, checking for user cart");
      const userCart = await Cart.findOne({ userId });
      return res.status(200).json(userCart || { products: [] });
    }

    if (guestCart.products.length === 0) {
      console.log("Guest cart is empty");
      return res.status(200).json({ products: [] });
    }

    let userCart = await Cart.findOne({ userId });
    console.log("User cart found:", userCart ? "Yes" : "No");

    if (!userCart) {
      console.log("Creating new user cart from guest cart");
      guestCart.userId = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      return res.status(200).json(guestCart);
    }

    console.log("Merging products from guest cart to user cart");
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
    console.log("User cart updated successfully");

    try {
      await Cart.findByIdAndDelete(guestCart._id);
      console.log("Guest cart deleted successfully");
    } catch (error) {
      console.error("Error deleting guest cart:", error);
    }

    return res.status(200).json(userCart);
  } catch (error) {
    console.error("Error in merge cart:", error);
    res.status(500).json({ message: "Server error during cart merge" });
  }
});

// Allow both guest and authenticated users to get cart
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear cart endpoint
router.delete("/clear", async (req, res) => {
  const { userId, guestId } = req.body;
  console.log("Clear cart request received:", { userId, guestId });

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear the cart by setting products to empty array and totalPrice to 0
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();
    
    console.log("Cart cleared successfully for:", { userId, guestId });
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
