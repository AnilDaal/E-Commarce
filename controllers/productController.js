import catchAsync from "../utils/catchAsync.js";

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

const addProduct = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const { title, description, category, price, image } = req.body;
  if (!title || !description || !category || !price || image) {
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

const getAllProduct = catchAsync(async (req, res, next) => {
  const productData = await Product.find();
  res.status(201).json({
    status: "succes",
    results: productData.length,
    data: productData,
  });
});

const getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const productData = await Product.findOne(productId);
  res.status(201).json({
    status: "succes",
    results: productData.length,
    data: productData,
  });
});

export {
  getSellerProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
};
