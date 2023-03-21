import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
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
    default: "admin",
  },
  required: [false, "Please confirm your password"],

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
  updatePassword: {
    type: Date,
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  // this.updatePassword = new Date().toJSON();
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.changePassword = async function (timeStamp) {
  if (this.updatePassword) {
    const time = parseInt(this.updatePassword.getTime() / 1000, 10);
    console.log(time, timeStamp);
    return time > timeStamp;
  }
  return false;
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
