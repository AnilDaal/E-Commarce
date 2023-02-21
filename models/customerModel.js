import mongoose from "mongoose";
import validator from "validator";

const customerSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: String,
  email: {
    type: String,
  },
  password: String,
  number: String,
  whishlist: String,
  address: String,
  purchasehistory: String,
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
