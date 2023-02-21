import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userid: String,
  rating: String,
  productSchema: String,
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
