import mongoose from "mongoose";
import AppError from "../utils/appError.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [8, "product have more than 8 charchter title"],
      require: [true, "product must have title"],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    description: {
      type: String,
      minlength: [10, "product have more than 8 charchter desc"],
    },
    details: {
      type: String,
    },
    totalProduct: {
      type: Number,
      validate: {
        validator: function (value) {
          if (value > this.quantity) {
            return AppError(
              "total number of product should be below quantity",
              401
            );
          }
        },
      },
    },
    stock: {
      type: Boolean,
      default: true,
      validate: {
        validator: function (value) {
          if (this.quantity < 1) {
            this.stock = false;
          }
        },
        message: "product not available right now",
      },
    },
    category: String,
    quantity: {
      type: Number,
      min: 1,
      require: [true, "product must have quantity"],
    },
    price: { type: String, require: [true, "product must have price"] },
    date_added: {
      type: Date,
      default: Date.now(),
    },
    image: {
      type: String,
      require: [true, "product must have image"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
