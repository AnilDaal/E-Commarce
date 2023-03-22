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
    { new: true, runValidators: false }
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
  const adminData = new Admin({
    email,
    password,
    confirmPassword,
    name,
  });
  await adminData.save();
  const token = jwt.sign(
    { id: adminData._id, role: adminData.roles },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
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
  const token = jwt.sign(
    { id: adminData._id, role: adminData.roles },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  res.status(201).json({
    status: "success",
    token,
  });
});

const updateAdmin = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  const adminId = req.user._id;
  if (!adminId) {
    return next("Please Login or Signup", 401);
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

const updateAdminPassword = catchAsync(async (req, res, next) => {
  const { currentPass, password, confirmPassword } = req.body;
  const adminId = req.user._id;
  if (!adminId) {
    return next("Please Login or Signup", 401);
  }
  const adminData = await Admin.find(adminId);
  if (!adminData.currentPassword(currentPass, adminData.password)) {
    return next(new AppError("Please Enter Correct Password", 401));
  }
  await adminData.save();
  res.status(201).json({
    status: "success",
    data: adminData,
  });
});

const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const adminData = await Admin.findOne({ email });
  if (!adminData) {
    return next(new AppError("User not found with this id", 404));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const adminData = await Admin.findOne({ email });
  if (!adminData) {
    return next(new AppError("User not found with this id", 404));
  }
});

export {
  adminSignup,
  adminLogin,
  updateAdmin,
  updateAdminPassword,
  verifyKyc,
  resetPassword,
  forgetPassword,
};
