const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function() {
      return !this.guestId; // Only required if guestId is not present
    }
  },
  guestId: {
    type: String,
    required: function() {
      return !this.user; // Only required if user is not present
    }
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: String,
      image: String,
      price: Number,
      size: String,
      color: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Check if the model is already compiled
module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);