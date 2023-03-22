import Seller from "../models/sellerModel.js";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

// seller signup
const SellerSignup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    number,
    address,
    pancard,
    confirmPassword,
    adharcard,
  } = req.body;
  if (
    !email ||
    !pancard ||
    !adharcard ||
    !name ||
    !number ||
    !address ||
    !confirmPassword
  ) {
    return next(new AppError("Please fill all field", 401));
  }
  const sellerData = await Seller.create({
    name,
    email,
    pancard,
    adharcard,
    number,
    address,
    password,
    confirmPassword,
  });
  const token = jwt.sign(
    { id: sellerData._id, role: sellerData.roles },
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

// seller login
const SellerLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please fill all field", 401));
  }
  const sellerData = await Seller.findOne({ email }).select("+password");
  if (
    !sellerData ||
    !(await sellerData.correctPassword(password, sellerData.password))
  ) {
    return next(new AppError("email or password not match", 401));
  }
  if (!sellerData.isVerified) {
    return next(new AppError("you are not verified till now", 401));
  }
  const token = jwt.sign(
    { id: sellerData._id, role: sellerData.roles },
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

const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const sellerData = await Seller.findOne({ email });
  if (!sellerData) {
    return next(new AppError("User not found with this id", 404));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const sellerData = await Seller.findOne({ email });
  if (!sellerData) {
    return next(new AppError("User not found with this id", 404));
  }
  // 2) Generate the random reset token
  const resetToken = sellerData.createPasswordResetToken();
  // validateBeforeSave: flase
  await sellerData.save();
});

const updateSeller = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  const sellerId = req.user._id;
  if (!sellerId) {
    return next("Please Login or Signup", 401);
  }
  const sellerData = await Seller.findByIdAndUpdate(
    sellerId,
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
    data: sellerData,
  });
});

const updateSellerPassword = catchAsync(async (req, res, next) => {
  const { currentPass, password, confirmPassword } = req.body;
  const sellerId = req.user._id;
  if (!sellerId) {
    return next("Please Login or Signup", 401);
  }
  console.log("help");
  const sellerData = await Seller.findById(sellerId);
  console.log(sellerData);
  if (
    !sellerData ||
    !(await sellerData.correctPassword(password, sellerData.password))
  ) {
    return next(new AppError("Please Enter Correct Password", 401));
  }
  const updateSellerData = await Seller.findByIdAndUpdate(
    sellerId,
    {
      $set: {
        password: currentPass,
        confirmPassword,
      },
    },
    { new: true }
  );
  await updateSellerData.save();
  res.status(201).json({
    status: "success",
    data: updateSellerData,
  });
});

const getSellerProduct = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const productData = await Product.find({ sellerId });
  // find the seller using id and after all find the product list in the seller and show all of them
  if (!productData) {
    return next(new AppError(" No Product found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    results: productData.length,
    data: productData,
  });
});

export {
  SellerSignup,
  SellerLogin,
  getAllSeller,
  deleteSeller,
  getSellerProduct,
  getSingleSeller,
  updateSeller,
  updateSellerPassword,
  resetPassword,
  forgetPassword,
};
