import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: String,
  name: String,
  deliverSchema: String,
  amountSchema: String,
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  paymentSchema: String,
  totalAmount: String,
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
