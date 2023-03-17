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
  const token = jwt.sign({ id: customerData._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.status(201).json({
    status: "success",
    token,
  });
});

// customer login

const customerLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter Email or Password", 401));
  }
  const customerData = await Customer.findOne({ email }).select("+password");
  if (
    !customerData ||
    !(await customerData.securePassword(password, customerData.password))
  ) {
    return next(new AppError("email or password not match", 401));
  }
  const token = jwt.sign({ id: customerData._id }, process.env.SECRET_KEY_CUS, {
    expiresIn: "7d",
  });

  res.status(201).json({
    status: "success",
    token,
  });
});

// get history
const getHistory = catchAsync(async (req, res, next) => {
  const customerId = req.params.id;
  const customerData = await Order.findById(customerId);
  // update order schema and
  if (!customerData) {
    return res.status(401).json({ status: "failed", data: customerData });
  }
  res.status(201).json({
    status: "success",
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

export { customerSignup, customerLogin, getHistory, getSingleCustomer };
