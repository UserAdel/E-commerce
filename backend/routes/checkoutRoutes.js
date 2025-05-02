const express = require("express");
const Checkout = require("../models/checkout");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

// Create new checkout
router.post("/", protect, async(req, res) => {
    const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;
    if(!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({message: "No items in cart"});
    }   

    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
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

// Update payment status
router.put("/:id/pay", protect, async(req, res) => {
    const {paymentStatus, paymentDetails} = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout) {
            return res.status(404).json({message: "Checkout not found"});
        }
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

// Finalize checkout and create order
router.post("/:id/finalize", protect, async(req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout) {
            return res.status(404).json({message: "Checkout not found"});
        }

        if(checkout.isPaid && !checkout.isFinalized) {
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            });
            
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            
            // Clear the user's cart
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

module.exports = router;