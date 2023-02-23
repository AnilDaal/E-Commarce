import mongoose from "mongoose";

const product = new mongoose.Schema({
  title: String,
  sellerId: String,
  description: String,
  category: String,
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
