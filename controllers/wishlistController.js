import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";

// Customer Wishlist
const getCustomerWishlist = catchAsync(async (req, res) => {
  const customerId = req.params.customerId;
  const wishlistData = await Wishlist.findById(customerId);
  //  get wishlist using customer schema
  if (!wishlistData) {
    return res.status(401).json({ status: "failed", data: wishlistData });
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
  if (!wishlistData) {
    return { status: "failed", data: wishlistData };
  }
  // const addWishlist = await wishlistData.create({
  //   product: title,
  //   userid,
  // });
  return {
    status: "success",
    data: wishlistData,
  };
});

const updateCustomerWishlist = catchAsync(async (req, res) => {
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
    // update customer schema add wishlist cart data
    return res.status(401).json({ status: "failed", data: wishlistData });
  }
  res.status(201).json({
    status: "success",
    data: wishlistData,
  });
});

const deleteItemCustomerWishlist = catchAsync(async (req, res) => {
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
    // update customer schema add wishlist cart data
    return res.status(401).json({ status: "failed", data: wishlistData });
  }
  res.status(201).json({
    status: "success",
    data: wishlistData,
  });
});

export {
  getCustomerWishlist,
  addCustomerWishlist,
  updateCustomerWishlist,
  deleteItemCustomerWishlist,
};
