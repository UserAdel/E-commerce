const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoute');
const cartRoutes = require('./routes/cartRoutes'); 
const checkoutRoute = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes')
const subscribeRoutes = require('./routes/subscribeRoutes')
const adminRoutes = require('./routes/adminRoutes')
const productAdminRoutes = require('./routes/productAdminRoutes')
const ordersAdminRoutes = require('./routes/orderAdminRoutes.js')





// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/checkout", checkoutRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api",subscribeRoutes);
//admin routes
app.use("/api/admin/users",adminRoutes)
app.use("/api/admin/products",productAdminRoutes)
app.use("/api/admin/orders",ordersAdminRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 9000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

