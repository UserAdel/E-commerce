// Import required modules and models
const express = require("express");
const Checkout = require("../models/checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const {protect} = require("../middleware/Authmiddleware.js");
const mongoose = require("mongoose");
const router = express.Router();

/**
 * Create a new checkout
 * This route handles the initial checkout process
 * It creates a new checkout record with the user's cart items
 */
router.post("/", protect, async(req, res) => {
    // Destructure required fields from request body
    const {CheckoutItems, shippingAddress, city, postalCode, country, paymentMethod, totalPrice} = req.body;
    
    // Validate that there are items in the cart
    if(!CheckoutItems || CheckoutItems.length === 0) {
        return res.status(400).json({message: "No items in cart"});
    }   

    try {
        // Convert productIds to ObjectIds
        const formattedItems = CheckoutItems.map(item => ({
            ...item,
            productId: new mongoose.Types.ObjectId(item.productId)
        }));

        // Create a new checkout record in the database
        const newCheckout = await Checkout.create({
            user: req.user._id,
            CheckoutItems: formattedItems,
            shippingAddress,
            city,
            postalCode,
            country,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
        });
        
        console.log("Checkout created for user", req.user._id);
        res.status(201).json(newCheckout);

    } catch (error) {
        console.error("Error creating checkout:", error);
        res.status(500).json({message: error.message || "Error creating checkout"});
    }
});

/**
 * Update payment status
 * This route handles the payment confirmation process
 * It updates the checkout status when payment is received
 */
router.put("/:id/pay", protect, async(req, res) => {
    // Get payment details from request body
    const {paymentStatus, paymentDetails} = req.body;

    try {
        // Find the checkout by ID
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout) {
            return res.status(404).json({message: "Checkout not found"});
        }

        // Update payment status if payment is confirmed
        if(paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();
            res.status(200).json(checkout);
            console.log("Payment successful for checkout", checkout._id);
        } else {
            res.status(400).json({message: "Invalid payment status"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

/**
 * Finalize checkout and create order
 * This route completes the checkout process by creating an order
 * It also clears the user's cart after successful order creation
 */
router.post("/:id/finalize", protect, async(req, res) => {
    try {
        // Find the checkout by ID
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout) {
            return res.status(404).json({message: "Checkout not found"});
        }

        // Check if checkout is paid and not already finalized
        if(checkout.isPaid && !checkout.isFinalized) {
            // Create a new order from the checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.CheckoutItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                })),
                shippingAddress: {
                    address: checkout.shippingAddress,
                    city: checkout.city,
                    postalCode: checkout.postalCode,
                    country: checkout.country
                },
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails,
                status: "processing",
                createdAt: new Date()
            });
            
            // Mark checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            
            // Clear the user's cart after successful order creation
            const deletedCart = await Cart.findOneAndDelete({user: checkout.user});
            console.log("Cart deleted:", deletedCart ? "Yes" : "No");
            
            res.status(201).json({
                success: true,
                message: "Order created successfully",
                order: finalOrder
            });
        } else if(checkout.isFinalized) {
            res.status(400).json({message: "Checkout already finalized"});
        } else {
            res.status(400).json({message: "Checkout not paid"});
        }
    } catch (error) {
        console.error("Error finalizing checkout:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error creating order",
            error: error.stack
        });
    }
});

// Export the router for use in the main application
module.exports = router;