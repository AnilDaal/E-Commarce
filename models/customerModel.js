import mongoose from "mongoose";
import Cart from "./cartModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const customerSchema = new mongoose.Schema({
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
    minlength: [6, "password must have more than 6 character"],
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
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  accountActive: {
    type: Boolean,
    default: true,
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
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

customerSchema.pre(/^find/, function (next) {
  this.find({ accountActive: { $ne: false } });
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

customerSchema.methods.changePassword = async function (timeStamp) {
  if (this.passwordChangeAt) {
    const time = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return time > timeStamp;
  }
  return false;
};

customerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
