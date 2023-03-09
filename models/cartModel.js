import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productId: [
    {
      type: String,
    },
  ],
});
// demo
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
