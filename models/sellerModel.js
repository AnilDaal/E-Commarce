import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
  name: String,
  email: String,
  password: String,
  date_added: { type: Date, default: Date.now(), select: false },
  isVarified: Boolean,
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
