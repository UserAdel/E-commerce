const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/Authmiddleware");
const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
  try {
    console.log("Fetching all orders...");
    console.log("User making request:", req.user._id);
    
    const orders = await Order.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders`);
    
    if (orders.length === 0) {
      console.log("No orders found in database");
      return res.json([]);
    }
    
    console.log("First order sample:", {
      id: orders[0]._id,
      user: orders[0].user,
      status: orders[0].status,
      totalPrice: orders[0].totalPrice
    });
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    console.log("Updating order:", req.params.id);
    console.log("Update data:", req.body);
    
    const order = await Order.findById(req.params.id).populate("user", "username");
    if (!order) {
      console.log("Order not found:", req.params.id);
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    order.isDelivered = req.body.status === "delivered" ? true : order.isDelivered;
    order.deliveredAt = req.body.status === "delivered" ? Date.now() : order.deliveredAt;

    const updatedOrder = await order.save();
    console.log("Order updated successfully:", updatedOrder._id);
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
