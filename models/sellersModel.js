import mongoose from "mongoose";

const sellersSchema = new Schema({
  userid: String,
  name: String,
  email: String,
  password: String,
  address: String,
  date_added: Date,
  productSchema: String,
});

const Seller = mongoose.model("Seller", sellersSchema);

export default Seller;
