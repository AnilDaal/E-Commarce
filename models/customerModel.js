import mongoose from "mongoose";
import Cart from "./cartModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

const customerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    validate: [validator.isEmail, "Enter correct email"],
    unique: [true, "Email must be unique"],
    required: [true, "Email must be required"],
    lowercase: true,
  },
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  isCustomer: { type: Boolean, default: true },
  password: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: [6, "password must have more than 6 character"],
    select: false,
  },
  // only use when create and save!!
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Password not match",
    },
  },
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
  isVerified: { type: Boolean, default: false },
  address: String,
});

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

customerSchema.methods.securePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
