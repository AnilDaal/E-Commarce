import mongoose from "mongoose";
import Cart from "./cartModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

const customerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: {
    type: String,
    validate: [validator.isEmail, "Enter correct email"],
    unique: [true, "Email must be unique"],
    required: [true, "Email must be required"],
    lowercase: true,
  },
  roles: {
    type: String,
    enum: ["admin", "seller", "customer"],
    default: "customer",
  },
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
  passwordChangeAt: { type: Date },
  passwordResetToken: String,
  passwordResetExpires: Date,
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
  accountActive: {
    type: Boolean,
    default: true,
  },
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

customerSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

customerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

customerSchema.methods.updatePassword = async function (timeStamp) {
  if (this.passwordChangeAt) {
    const time = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return time > timeStamp;
  }
  return false;
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
