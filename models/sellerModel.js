import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
  name: { type: String, require: [true, "seller must have name"] },
  email: {
    type: String,
    require: [true, "seller must have email"],
    unique: true,
  },
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: true },
  isCustomer: { type: Boolean, default: false },
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
