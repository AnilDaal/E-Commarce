import Customer from "../models/customerModel.js";
import Admin from "../models/adminModel.js";
import Seller from "../models/sellerModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcrypt";

// Customer Controller

const getAllCustomer = catchAsync(async (req, res, next) => {
  const customerData = await Customer.find();
  if (!customerData) {
    return res.status(401).json({ status: "failed", data: customerData });
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
    return new AppError(`No Customer found with this Id`, 404);
  }
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});

const deleteCustomer = catchAsync(async (req, res, next) => {
  const customerId = req.params.customerId;
  const customerData = await Customer.findByIdAndDelete(customerId);
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});
// Sellers Controllers

const getAllSeller = catchAsync(async (req, res, next) => {
  const sellerData = await Seller.find();
  if (!sellerData) {
    return res.status(401).json({ status: "failed", data: sellerData });
  }
  res.status(201).json({
    status: "success",
    results: sellerData.length,
    data: sellerData,
  });
});

const getSingleSeller = catchAsync(async (req, res, next) => {
  const sellerId = req.params.id;
  const sellerData = await Seller.findById(sellerId);
  if (!sellerData) {
    return res.status(401).json({ status: "failed", data: sellerData });
  }
  res.status(201).json({
    status: "success",
    results: sellerData,
    data: sellerData,
  });
});

const deleteSeller = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;

  const sellerData = await Seller.findByIdAndDelete(sellerId);
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// Sellers Kyc

const verifyKyc = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const { isVerified } = req.body;
  const sellerData = await Seller.findByIdAndUpdate(
    sellerId,
    {
      $set: {
        isVerified,
      },
    },
    { new: true }
  );
  if (!sellerData) {
    return res.status(401).json({
      status: "failed",
      message: "invalid id",
    });
  }
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// admin login

const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const adminData = await Admin.findOne({ email });
  if (!adminData) {
    return res.status(401).json({
      status: "failed",
      message: "invailid id ",
    });
  }
  const securePassword = bcrypt.compare(password, adminData.password);
  if (!securePassword) {
    return res.status(401).json({
      status: "failed",
      message: "invailid password",
    });
  }

  res.status(201).json({
    status: "success",
    data: adminData,
  });
});

const adminSignup = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(401).json({
      status: "failed",
      message: "Please fill all field",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);
  const adminData = await Admin.create({
    email,
    password: securePassword,
    name,
  });
  res.status(201).json({
    status: "success",
    data: adminData,
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
