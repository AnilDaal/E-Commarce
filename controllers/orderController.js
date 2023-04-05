import catchAsync from "../utils/catchAsync.js";
import Order from "../models/orderModel.js";
import AppError from "../utils/appError.js";
import Product from "../models/productModel.js";

export const createOrder = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(AppError("Please Login or Signup", 401));
  }
  const { orderProduct, totalItems, paymentId, orderTotal, addressId } =
    req.body;

  orderProduct.map(async (data) => {
    const productData = await Product.findById(data.productId);
    productData.finalQua(data.productQuantity);
    await productData.save();
  });

  if (!orderProduct || !totalItems || !orderTotal || !paymentId || !addressId) {
    return next(new AppError("please enter all field ", 401));
  }

  const orderData = await Order.create({
    customerId: req.user._id,
    orderProduct,
    orderTotal,
    paymentId,
    totalItems,
    addressId,
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
