import mongoose from "mongoose";

const sellerKycSchema = new mongoose.Schema({
  name: String,
  email: String,
  pancard: String,
  adharcard: String,
  number: String,
  address: String,
  isVarified: Boolean,
});

const SellerKyc = mongoose.model("SellerKyc", sellerKycSchema);
export default SellerKyc;
