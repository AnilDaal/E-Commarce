import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  productId: [
    {
      type: String,
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
