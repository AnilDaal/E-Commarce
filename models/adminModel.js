import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  isAdmin: { type: Boolean, default: true },
  isSeller: { type: Boolean, default: false },
  isCustomer: { type: Boolean, default: false },
  password: { type: String, minlength: 4 },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
