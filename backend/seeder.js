const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User"); // Fixed capitalization
const products = require("./data/products");

dotenv.config();
mongoose.connect(process.env.MONGO_URI)

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany(); // Fixed capitalization
    
    const createdUser = await User.create({
      name: "Admin", // correct field matching your schema
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });
    
    const userID = createdUser._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID }
    });

    await Product.insertMany(sampleProducts);
    console.log("Data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error.message);
    process.exit(1); 
  }
};

// Execute the seeder function
seedData();