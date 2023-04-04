import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  wishlistProduct: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      productQuantity: String,
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
