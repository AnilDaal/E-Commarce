import mongoose from "mongoose";

const sellerKycSchema = new mongoose.Schema({
  name: { type: String, require: [true, "seller must have name"] },
  email: { type: String, require: [true, "seller must have email"] },
  pancard: String,
  adharcard: String,
  number: String,
  address: String,
  isVerified: Boolean,
});

const SellerKyc = mongoose.model("SellerKyc", sellerKycSchema);
export default SellerKyc;
