import Wishlist from "../models/wishlistModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Customer Wishlist
const getCustomerWishlist = catchAsync(async (req, res, next) => {
  const customerId = req.params.customerId;
  const wishlistData = await Wishlist.findById(customerId);
  //  get wishlist using customer schema
  if (!wishlistData) {
    return next(new AppError("No Wishlist found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: wishlistData,
  });
});

const addCustomerWishlist = catchAsync(async (customerId) => {
  const wishlistData = await Wishlist.create({
    _id: customerId,
  });
  // update customer schema and add data in the wishlistcustomer
  // const addWishlist = await wishlistData.create({
  //   product: title,
  //   userid,
  // });
  return {
    status: "success",
    data: wishlistData,
  };
});

const updateCustomerWishlist = catchAsync(async (req, res, next) => {
  const { customerId, productId } = req.params;
  const wishlistData = await Wishlist.findByIdAndUpdate(
    customerId,
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
  const { customerId, productId } = req.params;
  const wishlistData = await Wishlist.findByIdAndUpdate(
    customerId,
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
