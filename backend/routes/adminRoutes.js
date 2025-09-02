const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/Authmiddleware");
const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
  try {
    console.log("Fetching all users...");
    const users = await User.find({}).select('-password');
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/", protect, admin, async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || "customer",
    });

    // Save user
    const savedUser = await user.save();
    console.log("User created successfully:", savedUser._id);

    // Return user without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      message: "User created successfully", 
      user: userResponse 
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation Error", 
        error: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;

    const updatedUser = await user.save();
    console.log("User updated successfully:", updatedUser._id);

    // Return user without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({ 
      message: "User updated successfully", 
      user: userResponse 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation Error", 
        error: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    console.log("User deleted successfully:", req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
