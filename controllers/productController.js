import catchAsync from "../utils/catchAsync.js";
import Product from "../models/productModel.js";
import AppError from "../utils/appError.js";

const addSellerProduct = catchAsync(async (req, res, next) => {
  const sellerId = req.user._id;
  const { title, description, category, price, image } = req.body;
  if (!title || !description || !category || !price || !image) {
    return next(new AppError("please fill all field", 401));
  }
  const productData = await Product.create({ ...req.body, sellerId });
  // productData._id = sellerId;
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
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
  const { productId } = req.params;
  const productData = await Product.findByIdAndDelete(productId);
  if (!productData) {
    return next(new AppError("No Product found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});

const getAllProduct = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    const totalProduct = await Product.countDocuments();
    if (skip > totalProduct) {
      return next(new AppError("This page does not exist", 401));
    }
  }
  const productData = await Product.find().skip(skip).limit(limit);
  res.status(201).json({
    status: "succes",
    results: productData.length,
    data: productData,
  });
});

const getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const productData = await Product.findById(productId);
  res.status(201).json({
    status: "succes",
    data: productData,
  });
});

export {
  addSellerProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
};
