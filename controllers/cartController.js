import Cart from "../models/cartModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Product from "../models/productModel.js";

const addCustomerCart = async (customerId) => {
  const cartData = await Cart({
    _id: customerId,
  });
  await cartData.save({ validateBeforeSave: false });
};

const getCustomerCart = catchAsync(async (req, res, next) => {
  const customerId = req.user._id;
  const cartData = await Cart.findById(customerId).populate(
    "cartProduct.productId"
  );
  // .populate({
  //   path: "wishlist",
  //   model: "Wishlist",
  // });
  // get customer cart using customer schema
  if (!cartData) {
    return next(new AppError("No Cart found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    results: cartData.cartProduct.length,
    data: cartData,
  });
});

// const updateCustomerCart = catchAsync(async (req, res, next) => {
//   const { productId } = req.params;
//   if (!req.user._id) {
//     return next(new AppError("No user found please login or signup", 403));
//   }
//   const cartData = await Cart.findByIdAndUpdate(
//     req.user._id,
//     {
//       $addToSet: {
//         productId,
//       },
//     },
//     {
//       new: true,
//     }
//   );
//   // update cart schema using customer schema
//   if (!cartData) {
//     return next(new AppError("No Cart found with this Id", 401));
//   }
//   res.status(201).json({
//     status: "success",
//     data: cartData,
//   });
// });

const updateCustomerCart = catchAsync(async (req, res, next) => {
  const { cartProduct } = req.body;
  const productData = await Cart.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        cartProduct,
      },
    },
    { new: true }
  );
  if (!productData) {
    return next(new AppError("No Cart found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

const deleteItemCustomerCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!req.user._id) {
    return next(new AppError("Please login for cart changes", 403));
  }
  const cartData = await Cart.find(req.user._id, {
    cartProduct: { $elemMatch: { productId } },
  });
  const cartNewData = await Cart.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        cartProduct: { _id: cartData[0].cartProduct[0]._id },
      },
    },
    { new: true }
  );
  // update cart schema using customer schema
  if (!cartNewData) {
    return next(new AppError("No Cart found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: cartNewData,
  });
});

const addItemPublicCart = catchAsync(async (req, res, next) => {
  // const { customerId, productId } = req.body;
  // const cartData = await Cart.findByIdAndUpdate(
  //   customerId,
  //   {
  //     $push: {
  //       productId,
  //     },
  //   },
  //   { new: true }
  // );
  // res.status(201).json({
  //   status: "success",
  //   data: cartData,
  // });
  res.status(401).json({
    message: "Route not define yet",
  });
});
// const getPublicWishlist = async (req, res,next) => {
//   try {
//     // add product in local storage in the browser and access in the brower without login
//   } catch (error) {
//     res.status(401).json({
//       status: "failed",
//       message: error.message,
//     });
//   }
// };

export {
  getCustomerCart,
  addCustomerCart,
  updateCustomerCart,
  deleteItemCustomerCart,
  addItemPublicCart,
};
