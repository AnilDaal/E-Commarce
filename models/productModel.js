import mongoose from "mongoose";

const product = new mongoose.Schema({
  title: String,
  sellerId: String,
  description: String,
  stock: { type: Boolean, default: true },
  category: String,
  quantity: Number,
  price: String,
  date_added: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
  },
});

const Product = mongoose.model("Product", product);

export default Product;
