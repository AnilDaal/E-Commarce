import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  date_added: { type: Date, default: Date.now(), select: false },
  productSchema: String,
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
