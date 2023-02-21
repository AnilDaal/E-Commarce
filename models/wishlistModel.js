import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userid: String,
  product: {
    type: String,
  },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
