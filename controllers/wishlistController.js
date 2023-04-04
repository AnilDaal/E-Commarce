import Wishlist from "../models/wishlistModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Customer Wishlist
const getCustomerWishlist = catchAsync(async (req, res, next) => {
  if (!req.user._id) {
    return next(AppError("Please Login or Signup", 401));
  }
  const wishlistData = await Wishlist.findById(req.user._id);
  //  get wishlist using customer schema
  if (!wishlistData) {
    return next(new AppError("No Wishlist found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: wishlistData,
  });
});

const addCustomerWishlist = async (customerId) => {
  const cartData = await Wishlist({
    _id: customerId,
  });
  await cartData.save({ validateBeforeSave: false });
};

const updateCustomerWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!req.user._id) {
    return next(AppError("Please Login or Signup", 401));
  }
  const wishlistData = await Wishlist.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        productId: productId,
      },
    },
    {
      new: true,
    }
  );
  if (!wishlistData) {
    return next(new AppError("No Wishlist found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: wishlistData,
  });
});

const deleteItemCustomerWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!req.user._id) {
    return next(AppError("Please Login or Signup", 401));
  }
  const wishlistData = await Wishlist.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        productId: productId,
      },
    },
    {
      new: true,
    }
  );
  if (!wishlistData) {
    return next(new AppError("No Wishlist found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: wishlistData,
  });
});

const addItemPublicWishlist = catchAsync(async (req, res, next) => {
  // const { customerId, productId } = req.body;
  // const wishlistData = await Wishlist.findByIdAndUpdate(
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
  //   data: wishlistData,
  // });
  res.status(401).json({
    message: "Route not define yet",
  });
});

export {
  getCustomerWishlist,
  addCustomerWishlist,
  updateCustomerWishlist,
  deleteItemCustomerWishlist,
  addItemPublicWishlist,
};
