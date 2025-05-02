const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoute');
const cartRoutes = require('./routes/cartRoutes'); 
const checkoutRoute=require('./routes/checkoutRoutes');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
connectDB();

//API Routes

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/checkout",checkoutRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});