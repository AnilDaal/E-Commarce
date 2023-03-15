import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 10,
    require: [true, 'product must have title'],
  },
  sellerId: String,
  description: {
    type: String,

    minlength: 10,
  },
  short_description: {
    type: String,
  },
  stock: { type: Boolean, default: true },
  category: String,
  quantity: {
    type: Number,
    min: 1,
    require: [true, 'product must have quantity'],
  },
  sale_price: String,
  price: { type: String, require: [true, 'product must have price'] },
  date_added: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    require: [true, 'product must have image'],
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
