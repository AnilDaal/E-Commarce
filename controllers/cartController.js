import Cart from "../models/cartModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const addCustomerCart = catchAsync(async (customerId) => {
  const cartData = await Cart.create({
    _id: customerId,
  });
  return {
    status: "success",
    data: cartData,
  };
});

const getCustomerCart = catchAsync(async (req, res, next) => {
  const customerId = req.params.customerId;
  const cartData = await Cart.findById(customerId);
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
    data: cartData,
  });
});

const updateCustomerCart = catchAsync(async (req, res, next) => {
  const { customerId, productId } = req.params;
  const cartData = await Cart.findByIdAndUpdate(
    customerId,
    {
      $push: {
        productId,
      },
    },
    {
      new: true,
    }
  );
  // update cart schema using customer schema
  if (!cartData) {
    return next(new AppError("No Cart found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: cartData,
  });
});
const deleteItemCustomerCart = catchAsync(async (req, res, next) => {
  const { customerId, productId } = req.params;
  const cartData = await Cart.findByIdAndUpdate(
    customerId,
    {
      $pull: {
        productId,
      },
    },
    {
      new: true,
    }
  );
  // update cart schema using customer schema
  if (!cartData) {
    return next(new AppError("No Cart found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: cartData,
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
