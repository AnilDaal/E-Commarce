import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userid: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
  desc: String,
  rating: { type: Number, min: 0, max: 5 },
  productSchema: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
