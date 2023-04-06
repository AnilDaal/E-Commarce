import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  wishlistProduct: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
