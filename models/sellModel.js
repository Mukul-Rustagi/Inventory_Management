const mongoose = require('mongoose');

const sellSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantitySold: {
    type: Number,
    required: true
  },
  quantityPurchased: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

sellSchema.post('save', async function (doc, next) {
  try {
    const Product = mongoose.model('Product');
    const product = await Product.findById(doc.product);
    
    // If the product quantity is below a certain threshold, send an alert
    if (product.quantity < 10) {
      sendEmail(
        'admin@example.com', // replace with the admin email
        'Inventory Alert: Low Stock',
        `Product ${product.name} is running low on stock. Current quantity: ${product.quantity}`
      );
    }

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error('Error in post save middleware:', err);
    next(err); // Pass the error to the next middleware or handler
  }
});

const Sell = mongoose.model('Sell', sellSchema);

module.exports = Sell;
