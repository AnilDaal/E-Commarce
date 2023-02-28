import Seller from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import Product from "../models/productModel.js";
import SellerKyc from "../models/sellerKycModel.js";

// seller signup
const sellerKyc = async (req, res) => {
  const { name, email, password, number, address, pancard, adharcard } =
    req.body;
  if (!email || !pancard || !adharcard || !name || !number || !address) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Please fill all field" });
  }
  try {
    const sellerData = await SellerKyc.create({
      name,
      email,
      pancard,
      adharcard,
      number,
      address,
    });
    res.status(201).json({
      status: "success",
      data: sellerData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

const SellerSignup = async (req, res) => {
  const { name, email, password, number } = req.body;
  if (!email || !name || !number || !password) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Please fill all field" });
  }
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);
  try {
    const sellerData = await Seller.create({
      name,
      email,
      number,
      password: securePassword,
    });
    res.status(201).json({
      status: "success",
      data: sellerData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

// seller login
const SellerLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      status: "failed",
      message: "please fill all field",
    });
  }
  try {
    const sellerData = await Seller.findOne({ email });
    if (!sellerData) {
      return res.status(401).json({
        status: "failed",
        message: "invailid id ",
      });
    }
    const securePassword = bcrypt.compare(password, sellerData.password);
    console.log(securePassword);
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
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

// product

const getProduct = async (req, res) => {
  const sellerId = req.params.sellerId;
  try {
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
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const addProduct = async (req, res) => {
  const sellerId = req.params.sellerId;
  const { title, description, category, price, image } = req.body;
  try {
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
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { sellerId, productId } = req.params;
  try {
    const productData = await Seller.findByIdAndUpdate(
      productId,
      {
        $set: {
          title,
          description,
          sellerId,
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
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};
export {
  sellerKyc,
  SellerSignup,
  SellerLogin,
  getProduct,
  addProduct,
  updateProduct,
};
