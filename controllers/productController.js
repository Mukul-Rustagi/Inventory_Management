// 


const Product = require('../models/productModel');
const Inventory = require('../models/inventoryModel');
const cloudinary = require("cloudinary").v2;

// Cloudinary file upload helper function
async function uploadFileToCloudinary(file, folder) {
  const options = { folder }; // Folder name on Cloudinary
  options.resource_type = "auto"; // Automatically detect file type (image, video, etc.)
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Create a new product in an inventory
exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, price, lowStockThreshold, inventoryId } = req.body;

    // Find the inventory by ID and check if the user is authorized
    const inventory = await Inventory.findById(inventoryId);
    console.log(inventory);

    // Check if the inventory exists
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    // Check if the user is authorized to access this inventory
    if (inventory.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this inventory' });
    }

    let imageUrl = '';

    // Check if image file is provided
    if (req.files && req.files.imageFile) {
      const imageFile = req.files.imageFile;
      const uploadResult = await uploadFileToCloudinary(imageFile, 'product_images'); // Specify Cloudinary folder
      imageUrl = uploadResult.secure_url; // Get the URL of uploaded image
    }

    // Create a new product and assign the uploaded image URL
    const product = new Product({
      name,
      quantity,
      price,
      lowStockThreshold,
      inventory: inventory._id,
      image: imageUrl, // Save product image URL
    });

    const createdProduct = await product.save();

    // Add the new product to the inventory's product list
    inventory.products.push(createdProduct._id);
    await inventory.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products for a specific inventory
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ inventory: req.query.inventoryId });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.name = req.body.name || product.name;
    product.quantity = req.body.quantity || product.quantity;
    product.price = req.body.price || product.price;
    product.lowStockThreshold = req.body.lowStockThreshold || product.lowStockThreshold;

    // Handle image update, if provided
    if (req.files && req.files.imageFile) {
      const imageFile = req.files.imageFile;
      const uploadResult = await uploadFileToCloudinary(imageFile, 'product_images'); // Specify Cloudinary folder
      product.image = uploadResult.secure_url; // Save updated Cloudinary URL
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
