import mongoose from "mongoose";

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
    stock: {
      type: Boolean,
      default: true,
      // validate: {
      //   validator: function () {
      //     if (this.quantity < 1) {
      //       this.stock = false;
      //     }
      //   },
      //   message: "product not available right now",
      // },
    },
    category: String,
    totalQuantity: {
      type: Number,
      require: [true, "product must have quantity"],
      default: 1,
      min: 0,
    },
    // totalProduct: {
    //   type: Number,
    //   validate: {
    //     validator: function (value) {
    //       if (value > this.quantity) {
    //         return AppError(
    //           "total number of product should be below quantity",
    //           401
    //         );
    //       }
    //     },
    //   },
    // },
    price: { type: Number, require: [true, "product must have price"] },
    image: {
      type: String,
      require: [true, "product must have image"],
    },
  },
  {
    timestamps: true,
  }
);

// productSchema.pre(/^find/, function (next) {
//   const productData = this.find({ stock: { $ne: true } });
//   // console.log(productData);
//   // if (productData) {
//   // productData.stock = false;
//   // }
//   next();
// });

productSchema.methods.finalQua = function (userQuantity) {
  if (this.totalQuantity === userQuantity) {
    this.stock = false;
  }
  this.totalQuantity = this.totalQuantity - userQuantity;
};

productSchema.index({ category: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
