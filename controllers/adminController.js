import Admin from "../models/adminModel.js";
import Seller from "../models/sellerModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

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

const adminSignup = catchAsync(async (req, res, next) => {
  const { email, password, name, confirmPassword } = req.body;
  if (!email || !password || !name || !confirmPassword) {
    return next(new AppError("Please Enter All field", 401));
  }
  const adminData = await Admin.create({
    email,
    password,
    confirmPassword,
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

const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter email or password", 400));
  }
  const adminData = await Admin.findOne({ email }).select("+password");
  if (
    !adminData ||
    !(await adminData.correctPassword(password, adminData.password))
  ) {
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

const updateAdmin = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  const adminId = req.user._id;
  if (!adminId) {
    return next("Can't find admin id", 401);
  }
  const adminData = await Admin.findByIdAndUpdate(
    adminId,
    {
      $set: {
        email,
        name,
      },
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: adminData,
  });
});

export { adminSignup, adminLogin, updateAdmin, verifyKyc };
