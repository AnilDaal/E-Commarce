import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
  name: {
    type: String,
    required: [true, "seller must have name"],
    minlength: 4,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "seller must have email"],
    unique: [true, "email allready exist"],
  },
  password: {
    type: String,
    required: [true, "seller must have password"],
    minlength: 8,
    maxlength: 20,
  },
  date_added: { type: Date, default: Date.now(), select: false },
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
