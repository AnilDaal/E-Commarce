import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  productId: [
    {
      type: String,
      unique: [true, "Id must be unique"],
      required: true,
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
