const mongoose = require('mongoose');

async function connectDB() { 
   try {
     await mongoose.connect(process.env.MONGODB_URI);
     console.log("MongoDB connected successfully");
   } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
   }
}

module.exports = connectDB;