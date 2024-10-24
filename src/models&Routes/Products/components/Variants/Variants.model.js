const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0.00,
  },
  mrp: {
    type: Number,
    default: 0.00,
  },
  sku: {
    type: String,
  },
  thumbnail: {
    type: String,
    default: 'default-image-url.jpg', // Default image URL if none provided
  },
  gallery:{
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
  },
  weathers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weather',
  }],
  occasions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Occasion',
  }],
  looks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Look',
  }],
  personalities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personality',
  }],
  charms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charm',
  }],
  color_lovers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ColorLover',
  }],
  search_tags: {
    type: [String],
    default: [],
  },
  stocks: [{
    size: String,
    stock: Number,
  }],
}, { versionKey: false });

variantSchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;
