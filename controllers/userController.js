const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Cloudinary upload function
async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  console.log("Temp file path:", file.tempFilePath);
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Register a new user with profile image upload
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    console.log(req.files
      .imageFile);
    if (!name || !email || !password || !req.files || !req.files.imageFile) {
      return res.status(400).json({ message: 'All fields are required including profile image' });
    }
    console.log(req)

    if (!req.files || !req.files.imageFile) {
      console.log(req.files);
      return res.status(400).json({
          success: "false",
          message: "No image uploaded"
      });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Get the uploaded image file
    const file = req.files.imageFile; // Ensure the field name matches what you use in Postman
    console.log(file);

    // Upload the profile image to Cloudinary
    const response = await uploadFileToCloudinary(file, "MUKUL");
    console.log("Cloudinary Response:", response);

    // Create the user in the database
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed in the User model's pre-save hook
      profileImage: response.secure_url, // Store the secure URL of the image
    });

    // Successful registration
    res.status(201).json({
      success: "true",
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Generate and return JWT token
    });
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).json({ 
      message: error.message });
  }
};


// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Successful login
      res.json({
        success: "true",
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // Send back the token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: "true",
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Update user profile with optional new profile image
// exports.updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user profile details
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;

//     const file = req.files.imageFile;
    
//     // Handle profile image upload if provided
//     if (req.file) {
//       // Upload to Cloudinary
//       const response = await uploadFileToCloudinary(file, "MUKUL");
//       user.profileImage = result.secure_url; // Update the profile image URL
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       profileImage: updatedUser.profileImage,
//       isAdmin: updatedUser.isAdmin,
//       token: generateToken(updatedUser._id), // Send a new token if needed
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete user profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      await user.remove();
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile details
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Handle profile image upload if provided
    if (req.files && req.files.imageFile) {
      const file = req.files.imageFile;
      console.log("Uploading new profile image...");

      // Upload to Cloudinary
      const response = await uploadFileToCloudinary(file, "MUKUL");
      console.log("Cloudinary Response:", response);

      // Update the profile image URL in the user document
      user.profileImage = response.secure_url;
    }

    const updatedUser = await user.save();

    res.json({
      success:"true",
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id), // Send a new token if needed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
