const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./routes/productRoutes'); // Import product routes
const inventoryRoutes = require('./routes/inventoryRoutes'); // Import inventory routes
const alertRoutes = require('./routes/alertRoutes'); // Import alert routes
const sellRoutes = require('./routes/sellRoutes'); // Import sell routes
const { protect } = require('./middleware/authMiddleware'); // Import auth middleware
const User = require('./models/userModel');
 
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extnded:true}))
// app.use(bodyParser.json()); // Parse JSON bodies
// app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
// Connect to MongoDB
const {dbConnect}=require("./config/database");
dbConnect();

const cloudinary = require("./config/cloudinaryConfig");
cloudinary.cloudinaryConnect();

// Route middleware
// app.use('/api/users', userRoutes);








app.use('/api/v1', userRoutes);
app.use('/api/products', protect, productRoutes); // Protect routes that need authentication
app.use('/api/inventories', protect, inventoryRoutes); // Protect routes that need authentication
app.use('/api/alerts', protect, alertRoutes); // Protect routes that need authentication
app.use('/api/sells', protect, sellRoutes); // Protect routes that need authentication

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
