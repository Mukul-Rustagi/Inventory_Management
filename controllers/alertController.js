const Alert = require('../models/alertModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const sendEmail = require('../config/emailConfig'); // Import the email service

// Create a new alert (with email functionality)
exports.createAlert = async (req, res) => {
  try {
    const { productId, alertType, message } = req.body;

    const product = await Product.findById(productId);
    const user = await User.findById(req.user._id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alert = new Alert({
      product: product._id,
      message,
      user: req.user._id,
      alertType,
    });

    // Save alert to database
    const createdAlert = await alert.save();

    // Send email notification to the user if alert is low stock or critical
    if (alertType === 'low stock' || alertType === 'expiry') {
      const emailText = `Dear ${user.name},\n\nThe product "${product.name}" has triggered a ${alertType} alert. Details: ${message}`;
      await sendEmail(user.email, `${alertType} Alert for ${product.name}`, emailText);

      // Update the alert to reflect that the email was sent
      createdAlert.emailSent = true;
      await createdAlert.save();
    }

    res.status(201).json(createdAlert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('product user');
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get alerts for a specific product
exports.getAlertsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const alerts = await Alert.find({ product: productId }).populate('product user');
    if (!alerts.length) {
      return res.status(404).json({ message: 'No alerts found for this product' });
    }
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
