import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        unique: [true, "this product allready added"],
      },
    ],
  },
  { timestamps: true }
);

export default Cart = mongoose.model("Cart", cartSchema);
