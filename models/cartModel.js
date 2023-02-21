import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  bill: String,
  quantity: String,
  stock: Boolean,
  product: {
    type: String,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
