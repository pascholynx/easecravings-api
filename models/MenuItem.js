const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['appetizer', 'main', 'dessert', 'beverage']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,  // in minutes
    required: true
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema); 