import Customer from "../models/customerModel.js";
import { addCustomerCart } from "../controllers/cartController.js";
import { addCustomerWishlist } from "../controllers/wishlistController.js";
import bcrypt from "bcrypt";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

//customer signup
const customerSignup = catchAsync(async (req, res, next) => {
  const { name, email, password, number } = req.body;
  if (!email || !password || !name || !number) {
    return next(new AppError("Please Enter All field", 401));
  }
  const salt = await bcrypt.genSalt(12);
  const securePassword = await bcrypt.hash(password, salt);
  const customerData = await Customer.create({
    name,
    email,
    password: securePassword,
    number,
  });
  // create cart and wishlist
  addCustomerCart(customerData._id);
  addCustomerWishlist(customerData._id);

  const token = jwt.sign({ id: customerData._id }, process.env.SECRET_KEY_CUS, {
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
  const customerData = await Customer.findOne({ email });
  if (
    !customerData ||
    (await bcrypt.compare(password, customerData.password))
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

export { customerSignup, customerLogin, getHistory };
