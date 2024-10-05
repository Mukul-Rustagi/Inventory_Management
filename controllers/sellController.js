const Sell = require('../models/sellModel');
const Product = require('../models/productModel');

// Create a new sale
// exports.createSell = async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     // Validate input
//     if (!productId || !quantity) {
//       return res.status(400).json({ message: 'Product ID and quantity are required' });
//     }

//     // Check if the product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Check if there is enough stock
//     if (quantity > product.quantity) {
//       return res.status(400).json({ message: 'Not enough stock available' });
//     }

//     // Create a new sale record
//     const newSell = new Sell({
//       product: productId,
//       user: req.user._id, // Link the sale to the logged-in user
//       quantity,
//       date: new Date(), // Set the date of the sale
//     });

//     // Save the sale record to the database
//     const createdSell = await newSell.save();

//     // Update the product quantity in the inventory
//     product.quantity -= quantity;
//     await product.save();

//     res.status(201).json(createdSell);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Create a new sale
exports.createSell = async (req, res) => {
  const { productId, quantitySold, quantityPurchased = 0 } = req.body;

  try {
    // Validate input
    if (!productId || !quantitySold) {
      return res.status(400).json({ message: 'Product ID and quantitySold are required' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if there is enough stock for sale
    if (quantitySold > product.quantity) {
      return res.status(400).json({ message: 'Not enough stock available for sale' });
    }

    // Create a new sale record
    const newSell = new Sell({
      product: productId,
      user: req.user._id, // Link the sale to the logged-in user
      quantitySold,
      quantityPurchased,
      date: new Date(), // Set the date of the sale
    });

    // Save the sale record to the database
    const createdSell = await newSell.save();

    // Update the product quantity in the inventory
    product.quantity -= quantitySold;
    product.quantity += quantityPurchased; // Add stock if purchases are recorded
    await product.save();

    if (product.quantity < 10) {
      sendEmail(
        'admin@example.com', // replace with your email
        'Low Stock Alert',
        `The stock for product ${product.name} is running low. Only ${product.quantity} left.`
      );
    }
    
    res.status(201).json(createdSell);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sales with pagination and filtering
exports.getAllSells = async (req, res) => {
  try {
    // Pagination
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    // Filtering
    const { userId, productId, startDate, endDate } = req.query;

    let filter = {};

    if (userId) filter.user = userId;
    if (productId) filter.product = productId;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Total count for pagination purposes
    const count = await Sell.countDocuments(filter);

    // Get the sales with filters, pagination, and sorting by date
    const sells = await Sell.find(filter)
      .populate('product user')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ date: -1 });

    res.status(200).json({
      sells,
      page,
      pages: Math.ceil(count / pageSize),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales for a specific product with pagination and filtering
exports.getSellByProduct = async (req, res) => {
  try {
    const { pageNumber, pageSize, startDate, endDate } = req.query;
    const productId = req.params.productId;

    // Pagination
    const page = Number(pageNumber) || 1;
    const size = Number(pageSize) || 10;

    // Filtering by date range
    let filter = { product: productId };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const count = await Sell.countDocuments(filter);

    const sells = await Sell.find(filter)
      .populate('product user')
      .limit(size)
      .skip(size * (page - 1))
      .sort({ date: -1 });

    res.status(200).json({
      sells,
      page,
      pages: Math.ceil(count / size),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
