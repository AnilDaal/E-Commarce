import Seller from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";

// seller signup
const SellerSignup = catchAsync(async (req, res) => {
  const { name, email, password, number, address, pancard, adharcard } =
    req.body;
  if (!email || !pancard || !adharcard || !name || !number || !address) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Please fill all field" });
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
const SellerLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      status: "failed",
      message: "please fill all field",
    });
  }
  const sellerData = await Seller.findOne({ email });
  if (!sellerData) {
    return res.status(401).json({
      status: "failed",
      message: "invailid id ",
    });
  }
  if (!sellerData.isVerified) {
    return res.status(401).json({
      status: "failed",
      message: "seller not verified",
    });
  }
  const securePassword = await bcrypt.compare(password, sellerData.password);
  if (!securePassword) {
    return res.status(401).json({
      status: "failed",
      message: "invailid password",
    });
  }

  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// product

const getProduct = catchAsync(async (req, res) => {
  const sellerId = req.params.sellerId;
  const productData = await Product.find({ sellerId });
  // find the seller using id and after all find the product list in the seller and show all of them
  if (!productData) {
    return res.status(401).json({ status: "failed", data: productData });
  }
  res.status(201).json({
    status: "success",
    results: productData.length,
    data: productData,
  });
});

const addProduct = catchAsync(async (req, res) => {
  const sellerId = req.params.sellerId;
  const { title, description, category, price, image } = req.body;

  const productData = await Product.create({
    title,
    sellerId,
    description,
    category,
    price,
    image,
  });
  // productData._id = sellerId;
  if (!productData) {
    return res.status(401).json({ status: "failed", data: productData });
  }
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

const updateProduct = catchAsync(async (req, res) => {
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
    return res.status(401).json({ status: "failed", data: productData });
  }
  res.status(201).json({
    status: "success",
    data: productData,
  });
});
export { SellerSignup, SellerLogin, getProduct, addProduct, updateProduct };
