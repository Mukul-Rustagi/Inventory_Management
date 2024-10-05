const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Inventory must belong to a user
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Array of products within the inventory
    },
  ],
}, { timestamps: true }); // Automatically manage createdAt and updatedAt

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
