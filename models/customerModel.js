import mongoose from "mongoose";
import Cart from "./cartModel.js";
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
      ref: "Wishlist",
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Cart,
    },
  ],
  address: String,
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
