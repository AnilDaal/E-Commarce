import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

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
  passwordChangeAt: { type: Date, default: Date.now(), select: false },
});

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

sellerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

sellerSchema.methods.changePassword = function (timeStamp) {
  if (this.passwordChangeAt) {
    console.log(this.passwordChangeAt.toTime());
    // return this.passwordChangeAt.toTime() < timeStamp
  }
};

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
