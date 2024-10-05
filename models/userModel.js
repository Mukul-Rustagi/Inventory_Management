const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String, // URL to profile image (can be stored via Cloudinary)
  },
  inventories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory' // User has multiple inventories
    }
  ]
}, { timestamps: true });

// Method to match passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
