import mongoose from "mongoose";
import Wishlist from "./wishlistModel.js";
import validator from "validator";

const customerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
  },
  password: String,
  number: String,
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Wishlist,
    },
  ],
  address: String,
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
