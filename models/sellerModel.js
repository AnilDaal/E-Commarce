import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";

const sellerSchema = new Schema({
  name: { type: String, require: [true, "seller must have name"] },
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
    default: "seller",
  },
  pancard: String,
  adharcard: String,
  number: String,
  address: String,
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
  isVerified: { type: Boolean, default: false },
  passwordChangeAt: { type: Date },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.passwordChangeAt = Date.now() - 1000;
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

sellerSchema.post(/^find/, function () {
  this.find({ isVerified: { $ne: false } });
});

sellerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

sellerSchema.methods.changePassword = function (timeStamp) {
  if (this.passwordChangeAt) {
    const time = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return time > timeStamp;
  }
  return false;
};

sellerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken, this.passwordResetToken);
  return resetToken;
};

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
