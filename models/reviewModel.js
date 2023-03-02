import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userid: [
    { type: String, unique: true },
    //   validator:{
    // validate:function(val){
    //   return this.userid>val;
    // }},message:"helo"}],
  ],
  rating: { type: Number, min: 0, max: 5 },
  productSchema: { type: String, unique: true },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
