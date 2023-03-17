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
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: true },
  isCustomer: { type: Boolean, default: false },
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
  date_added: { type: Date, default: Date.now(), select: false },
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

sellerSchema.methods.securePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
