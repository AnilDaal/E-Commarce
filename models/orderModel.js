import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userid: String,
  quantity: String,
  deliverSchema: String,
  amountSchema: String,
  productSchema: String,
  paymentSchema: String,
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
