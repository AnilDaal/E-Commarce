import Seller from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

// seller signup
const SellerSignup = catchAsync(async (req, res, next) => {
  const { name, email, password, number, address, pancard, adharcard } =
    req.body;
  if (!email || !pancard || !adharcard || !name || !number || !address) {
    return next(new AppError("Please fill all field", 401));
  }
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);
  const sellerData = await Seller.create({
    name,
    email,
    pancard,
    adharcard,
    number,
    address,
    password: securePassword,
  });
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// seller login
const SellerLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please fill all field", 401));
  }
  const sellerData = await Seller.findOne({ email });
  if (!sellerData && (await bcrypt.compare(password, sellerData.password))) {
    return next(new AppError("email or password not match", 401));
  }
  if (!sellerData.isVerified) {
    return next(new AppError("you are not verified till now", 401));
  }

  const token = jwt.sign({ user: sellerData }, process.env.SECRET_KEY_SEL, {
    expiresIn: "7d",
  });

  res.status(201).json({
    status: "success",
    data: token,
  });
});

// product

const getProduct = catchAsync(async (req, res, next) => {
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

const addProduct = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const { title, description, category, price, image } = req.body;
  if (!title || !description || !category || !price || image) {
    return next(new AppError("please fill all field", 401));
  }
  const productData = await Product.create({
    title,
    sellerId,
    description,
    category,
    price,
    image,
  });
  // productData._id = sellerId;
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { sellerId, productId } = req.params;
  const { title, description, category, price, image } = req.body;
  const productData = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        title,
        description,
        category,
        price,
        image,
      },
    },
    { new: true }
  );
  if (!productData) {
    return next(new AppError("No Product found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { sellerId, productId } = req.params;
  const productData = await Product.findByIdAndDelete(productId);
  if (!productData) {
    return next(new AppError("No Product found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

export {
  SellerSignup,
  SellerLogin,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
