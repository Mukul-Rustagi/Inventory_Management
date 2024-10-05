const Inventory = require('../models/inventoryModel');
const User = require('../models/userModel');

// Create a new inventory for a user
exports.createInventory = async (req, res) => {
  try {
    const { name } = req.body;

    const newInventory = new Inventory({
      name,
      user: req.user._id, // Assign the logged-in user to the inventory
    });

    const savedInventory = await newInventory.save();

    // Add inventory to the user's inventory list
    const user = await User.findById(req.user._id);
    user.inventories.push(savedInventory._id);
    await user.save();

    res.status(201).json(savedInventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all inventories for the logged-in user
exports.getUserInventories = async (req, res) => {
  try {
    const userWithInventories = await User.findById(req.user._id).populate('inventories');
    if (!userWithInventories) {
      return res.status(404).json({ message: 'No inventories found for this user' });
    }

    res.status(200).json(userWithInventories.inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
