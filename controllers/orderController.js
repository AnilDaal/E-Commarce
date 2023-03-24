import catchAsync from "../utils/catchAsync.js";
import Order from "../models/orderModel.js";
import AppError from "../utils/appError.js";

export const createOrder = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(AppError("Please Login or Signup", 401));
  }
  const { product, totalItems, orderTotal } = req.body;
  if (!product || !totalItems || !orderTotal) {
    return next(new AppError("please enter all field ", 401));
  }
  const orderData = await Order.create({
    customerId: req.user._id,
    product,
    orderTotal,
    totalItems,
  });
  res.status(201).json({
    status: "success",
    data: orderData,
  });
});

export const orderHistory = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(AppError("Please Login or Signup", 401));
  }
  const orderData = await Order.find({ customerId: req.user._id });
  res.status(201).json({
    status: "success",
    results: orderData.length,
    data: orderData,
  });
});
