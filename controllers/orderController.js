import catchAsync from "../utils/catchAsync.js";
import Order from "../models/orderModel.js";
import AppError from "../utils/appError.js";
import Product from "../models/productModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { response } from "express";

export const storeOrder = catchAsync(async (req, res, next) => {
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

export const createOrder = catchAsync(async (req, res, next) => {
  const { totalItems, orderTotal } = req.body;
  console.log(req.body);
  var instance = new Razorpay({
    key_id: process.env.PAYMENT_API_KEY,
    key_secret: process.env.PAYMENT_SECRET_KEY,
  });
  const orderData = await instance.orders.create({
    amount: orderTotal * 100,
    currency: "INR",
    notes: {
      totalItems,
    },
  });
  if (!orderData) {
    return next(new AppError("order not created", 401));
  }
  res.status(200).json({
    status: "success",
    data: orderData,
  });
});

export const paymentController = catchAsync((req, res, next) => {});

export const paymentVerify = catchAsync((req, res, next) => {
  // const { order_id, razorpay_payment_id, key_secret } = req.body;

  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", process.env.PAYMENT_SECRET_KEY)
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { signatureIsValid: "true" };
  res.status(200).send(response);
});
