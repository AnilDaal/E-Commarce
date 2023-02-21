import mongoose from "mongoose";

const deliverSchema = new mongoose.Schema({
  userid: String,
  deliveryAddress: String,
  deliveryDate: {
    type: Date,
  },
});

const Delivery = mongoose.model("Delivery", deliverSchema);

export default Delivery;
