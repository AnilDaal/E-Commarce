import mongoose from "mongoose";
import validator from "validator";

const addressSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  mobileNumber: {
    type: String,
    validate: [
      validator.isMobilePhone("IN"),
      "please enter valid mobile number",
    ],
  },
  pincode: String,
  houseNumber: String,
  ward: String,
  landmark: String,
  city: String,
  state: String,
  defaultAddress: {
    type: Boolean,
    default: false,
  },
});

export default Address = mongoose.model("Address", addressSchema);
