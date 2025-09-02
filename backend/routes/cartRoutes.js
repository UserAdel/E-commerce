const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/Authmiddleware");
const jwt = require("jsonwebtoken");

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

// Helper function to get user ID from token if available
const getUserIdFromToken = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user.id;
  } catch (error) {
    console.log("Error verifying token:", error.message);
    return null;
  }
};

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
  const { productId, quantity, size, color, guestId } = req.body;
  
  // Get userId from token if available
  const userId = getUserIdFromToken(req);
  
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

    // If user is logged in (has token), always use user cart
    if (userId) {
      let userCart = await Cart.findOne({ userId });
      let guestCart = guestId ? await Cart.findOne({ guestId }) : null;

      console.log("Found carts:", {
        userCart: userCart ? {
          id: userCart._id,
          productCount: userCart.products.length,
          totalPrice: userCart.totalPrice
        } : "Not found",
        guestCart: guestCart ? {
          id: guestCart._id,
          productCount: guestCart.products.length,
          totalPrice: guestCart.totalPrice
        } : "Not found"
      });

      // If no user cart exists, create one
      if (!userCart) {
        console.log("Creating new user cart");
        userCart = await Cart.create({
          userId,
          products: [],
          totalPrice: 0
        });
      }

      // If guest cart exists, merge its items into user cart
      if (guestCart && guestCart.products.length > 0) {
        console.log("Merging guest cart items into user cart");
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
            console.log("Updated existing item quantity:", {
              productId: guestItem.productId,
              newQuantity: userCart.products[productIndex].quantity
            });
          } else {
            userCart.products.push(guestItem);
            console.log("Added guest item to user cart:", {
              productId: guestItem.productId,
              quantity: guestItem.quantity
            });
          }
        });

        // Delete guest cart after merging
        try {
          await Cart.findByIdAndDelete(guestCart._id);
          console.log("Guest cart deleted after merging");
        } catch (error) {
          console.error("Error deleting guest cart:", error);
        }
      }

      // Add new item to user cart
      const productIndex = userCart.products.findIndex(
        (p) =>
          p.productId.toString() === productId.toString() &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // Update existing item quantity
        userCart.products[productIndex].quantity += quantity;
        console.log("Updated existing item quantity:", {
          productId,
          newQuantity: userCart.products[productIndex].quantity
        });
      } else {
        // Add new item
        const newItem = {
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        };
        userCart.products.push(newItem);
        console.log("Added new item to cart:", {
          productId,
          quantity
        });
      }

      // Calculate total price
      userCart.totalPrice = userCart.products.reduce((acc, item) => {
        const itemTotal = Number(item.price) * Number(item.quantity);
        console.log("Calculating item total:", {
          itemId: item.productId,
          price: item.price,
          quantity: item.quantity,
          itemTotal
        });
        return acc + itemTotal;
      }, 0);

      console.log("Final cart total:", userCart.totalPrice);
      await userCart.save();
      console.log("User cart updated successfully with merged items");
      return res.status(200).json(userCart);
    } else {
      // Handle guest cart
      let guestCart = await Cart.findOne({ guestId });
      
      if (guestCart) {
        console.log("Found existing guest cart");
        const productIndex = guestCart.products.findIndex(
          (p) =>
            p.productId.toString() === productId.toString() &&
            p.size === size &&
            p.color === color
        );

        if (productIndex > -1) {
          // Update existing item quantity
          guestCart.products[productIndex].quantity += quantity;
          console.log("Updated existing item quantity:", {
            productId,
            newQuantity: guestCart.products[productIndex].quantity
          });
        } else {
          // Add new item
          const newItem = {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          };
          guestCart.products.push(newItem);
          console.log("Added new item to cart:", {
            productId,
            quantity
          });
        }

        // Calculate total price
        guestCart.totalPrice = guestCart.products.reduce((acc, item) => {
          const itemTotal = Number(item.price) * Number(item.quantity);
          console.log("Calculating item total:", {
            itemId: item.productId,
            price: item.price,
            quantity: item.quantity,
            itemTotal
          });
          return acc + itemTotal;
        }, 0);

        console.log("Final cart total:", guestCart.totalPrice);
        await guestCart.save();
        console.log("Guest cart updated successfully");
        return res.status(200).json(guestCart);
      } else {
        console.log("Creating new guest cart");
        const newCart = await Cart.create({
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
          totalPrice: Number(product.price) * Number(quantity),
        });
        console.log("New guest cart created with total:", newCart.totalPrice);
        return res.status(201).json(newCart);
      }
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
  const { productId, size, color, guestId } = req.body;
  const userId = getUserIdFromToken(req);
  
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
  const { guestId } = req.body;
  const userId = req.user.id; // Now we can safely use req.user.id since protect middleware ensures it exists
  
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
