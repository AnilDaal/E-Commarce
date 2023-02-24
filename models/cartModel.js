import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product: [
    {
      type: String,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
