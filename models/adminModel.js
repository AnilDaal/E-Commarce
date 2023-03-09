import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: { type: String, minlength: 4 },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
