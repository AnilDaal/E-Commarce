import Customer from "../models/customerModel.js";
import { addCustomerCart } from "../controllers/cartController.js";
import { addCustomerWishlist } from "../controllers/wishlistController.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

//customer signup
const customerSignup = catchAsync(async (req, res, next) => {
  const { email, password, name, confirmPassword } = req.body;
  if (!email || !password || !name || !confirmPassword) {
    return next(new AppError("Please Enter All field", 401));
  }

  const customerData = await Customer.create({
    email,
    password,
    name,
    confirmPassword,
  });
  // create cart and wishlist
  addCustomerCart(customerData._id);
  addCustomerWishlist(customerData._id);
  const token = jwt.sign(
    { id: customerData._id, role: customerData.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.status(200).json({
    status: "success",
    token,
  });
});

const customerLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter Email or Password", 401));
  }
  const customerData = await Customer.findOne({ email }).select("+password");
  if (
    !customerData ||
    !(await customerData.correctPassword(password, customerData.password))
  ) {
    return next(new AppError("email or password not match", 401));
  }
  const token = jwt.sign(
    { id: customerData._id, role: customerData.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.status(200).json({
    status: "success",
    token,
  });
});

const getAllCustomer = catchAsync(async (req, res, next) => {
  const customerData = await Customer.find();
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

// get history
const getHistory = catchAsync(async (req, res, next) => {
  const customerId = req.params.id;
  const customerData = await Order.find(customerId);
  // update order schema and
  if (!customerData) {
    return new AppError(`No Order found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    results: customerData.length,
    data: customerData,
  });
});
const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const customerData = await Customer.findOne({ email });
  if (!customerData) {
    return next(new AppError("User not found with this id", 404));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const customerData = await Customer.findOne({ email });
  if (!customerData) {
    return next(new AppError("User not found with this id", 404));
  }
});

const updateCustomer = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  const customerId = req.user._id;
  if (!customerId) {
    return next("Please Login or Signup", 401);
  }
  const customerData = await Customer.findByIdAndUpdate(
    customerId,
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
    data: customerData,
  });
});

const updateCustomerPassword = catchAsync(async (req, res, next) => {
  const { currentPass, password, confirmPassword } = req.body;
  const customerId = req.user._id;
  if (!customerId) {
    return next("Please Login or Signup", 401);
  }
  const customerData = await Customer.find(customerId);
  if (!customerData.currentPassword(currentPass, customerData.password)) {
    return next(new AppError("Please Enter Correct Password", 401));
  }
  await customerData.save();
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});

export {
  customerSignup,
  customerLogin,
  getHistory,
  getSingleCustomer,
  getAllCustomer,
  deleteCustomer,
  updateCustomer,
  updateCustomerPassword,
  resetPassword,
  forgetPassword,
};
