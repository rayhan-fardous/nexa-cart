const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This line reads the variable from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;