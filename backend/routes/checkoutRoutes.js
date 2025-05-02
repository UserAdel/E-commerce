// Import required modules and models
const express = require("express");
const Checkout = require("../models/checkout");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * Create a new checkout
 * This route handles the initial checkout process
 * It creates a new checkout record with the user's cart items
 */
router.post("/", protect, async(req, res) => {
    // Destructure required fields from request body
    const {CheckoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;
    
    // Validate that there are items in the cart
    if(!CheckoutItems || CheckoutItems.length === 0) {
        return res.status(400).json({message: "No items in cart"});
    }   

    try {
        // Create a new checkout record in the database
        const newCheckout = await Checkout.create({
            user: req.user._id,
            CheckoutItems: CheckoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
        })
        console.log("Checkout created for user", req.user._id);
        res.status(201).json(newCheckout);

    } catch (error) {
        console.error("Error creating checkout", error);
        res.status(500).json({message: "Error creating checkout"});
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
                orderItems: checkout.CheckoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            });
            
            // Mark checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            
            // Clear the user's cart after successful order creation
            await Cart.findOneAndDelete({user: checkout.user});
            
            res.status(201).json(finalOrder);
        } else if(checkout.isFinalized) {
            res.status(400).json({message: "Checkout already finalized"});
        } else {
            res.status(400).json({message: "Checkout not paid"});
        }
    } catch (error) {
        console.error("Error finalizing checkout:", error);
        res.status(500).json({message: "Server error"});
    }
});

// Export the router for use in the main application
module.exports = router;