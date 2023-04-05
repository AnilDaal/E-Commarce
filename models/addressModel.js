import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  counrty: {
    type: String,
    required: [true, "user must have country"],
  },
  fullName: { type: String, required: [true, "user must have fullname"] },
  mobileNumber: {
    type: Number,
    required: [true, "user must have mobile Number"],
  },
  pincode: {
    type: Number,
    min: 6,
    max: 6,
    required: [true, "user must have pincode"],
  },
  houseNo: String,
  area: String,
  landmark: String,
  city: { type: String, required: [true, "user must have city"] },
  state: { type: String, required: [true, "user must have state"] },
  //   default: { type: Boolean, default: false },
});

// addressSchema.index(
//   { fullName: "text", counrty: "text", city: "text", state: "text" },
//   { unique: true }
// );

const Address = mongoose.model("Address", addressSchema);
export default Address;
