import Cart from "../models/cartModel.js";
import catchAsync from "../utils/catchAsync.js";

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

export {
  getCustomerCart,
  addCustomerCart,
  updateCustomerCart,
  deleteItemCustomerCart,
};
