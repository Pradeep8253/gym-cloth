import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    default: null,
  },
  category: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Unisex'],
  },
  sport: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    required: true,
  },
  colors: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
