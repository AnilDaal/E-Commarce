import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
  name: { type: String, require: [true, "seller must have name"] },
  email: { type: String, require: [true, "seller must have email"] },
  pancard: String,
  adharcard: String,
  number: String,
  address: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  date_added: { type: Date, default: Date.now(), select: false },
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
