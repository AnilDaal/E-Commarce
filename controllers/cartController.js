import Cart from "../models/cartModel.js";
import Customer from "../models/customerModel.js";
import catchAsync from "../utils/catchAsync.js";

const addCustomerCart = catchAsync(async (customerId) => {
  const cartData = await Cart.create({
    _id: customerId,
  });
  if (!cartData) {
    return { status: "failed", data: cartData };
  }
  return {
    status: "success",
    data: cartData,
  };
});

const getCustomerCart = catchAsync(async (req, res) => {
  const customerId = req.params.customerId;
  const cartData = await Cart.findById(customerId);
  // .populate({
  //   path: "wishlist",
  //   model: "Wishlist",
  // });
  // get customer cart using customer schema
  if (!cartData) {
    return res.status(401).json({ status: "failed", data: cartData });
  }
  res.status(201).json({
    status: "success",
    data: cartData,
  });
});

const updateCustomerCart = catchAsync(async (req, res) => {
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
    return res.status(401).json({ status: "failed", data: cartData });
  }
  res.status(201).json({
    status: "success",
    data: cartData,
  });
});
const deleteItemCustomerCart = catchAsync(async (req, res) => {
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
    return res.status(401).json({ status: "failed", data: cartData });
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
