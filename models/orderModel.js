import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    orderProduct: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productQuantity: { type: Number, default: 1 },
      },
    ],
    paymentId: String,
    totalItems: Number,
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    orderTotal: Number,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
