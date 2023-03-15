import Customer from "../models/customerModel.js";
import Admin from "../models/adminModel.js";
import Seller from "../models/sellerModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Customer Controller

const getAllCustomer = catchAsync(async (req, res, next) => {
  const customerData = await Customer.find();
  if (!customerData) {
    return next(new AppError("customer not found", 401));
  }
  res.status(201).json({
    status: "success",
    results: customerData.length,
    data: customerData,
  });
});

const getSingleCustomer = catchAsync(async (req, res, next) => {
  const customerId = req.params.customerId;
  const customerData = await Customer.findById(customerId);
  if (!customerData) {
    return new AppError(`No Customer found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});

const deleteCustomer = catchAsync(async (req, res, next) => {
  const customerId = req.params.customerId;
  const customerData = await Customer.findByIdAndDelete(customerId);
  if (!customerData) {
    return new AppError(`No Customer found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});
// Sellers Controllers

const getAllSeller = catchAsync(async (req, res, next) => {
  const sellerData = await Seller.find();
  if (!sellerData) {
    return next(new AppError("no seller found", 400));
  }
  return res.status(201).json({
    status: "success",
    results: sellerData.length,
    data: sellerData,
  });
});

const getSingleSeller = catchAsync(async (req, res, next) => {
  const sellerId = req.params.id;
  const sellerData = await Seller.findById(sellerId);
  if (!sellerData) {
    return next(new AppError("No Seller found with this Id", 400));
  }
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

const deleteSeller = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const sellerData = await Seller.findByIdAndDelete(sellerId);
  if (!sellerData) {
    return next(new AppError("No Seller found with this Id", 400));
  }
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// Sellers Kyc

const verifyKyc = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const sellerData = await Seller.findByIdAndUpdate(
    sellerId,
    {
      $set: {
        isVerified: true,
      },
    },
    { new: true }
  );
  if (!sellerData) {
    return next(new AppError("No Seller found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// admin login

const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter email or password", 400));
  }
  const adminData = await Admin.findOne({ email });

  if (!adminData && !(await bcrypt.compare(password, adminData.password))) {
    return next(new AppError("invalid email or password", 401));
  }
  const token = jwt.sign({ id: adminData._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  res.status(201).json({
    status: "success",
    token,
  });
});

const adminSignup = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    next(new AppError("please fill all filled", 401));
  }
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);
  const adminData = await Admin.create({
    email,
    password: securePassword,
    name,
  });
  const token = jwt.sign({ id: adminData._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.status(201).json({
    status: "success",
    token,
  });
});

export {
  adminSignup,
  adminLogin,
  getAllCustomer,
  getSingleCustomer,
  getAllSeller,
  getSingleSeller,
  deleteCustomer,
  deleteSeller,
  verifyKyc,
};
