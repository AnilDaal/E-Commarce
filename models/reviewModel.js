import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  desc: String,
  rating: { type: Number, min: 0, max: 5 },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
