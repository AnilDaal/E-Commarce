import Seller from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import Product from "../models/productModel.js";

// seller signup
const sellerSignup = async (req, res) => {
  const { name, email, password, number, address } = req.body;
  if (!email || !password || !name || !number || !address) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Please fill all field" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);
    const productData = await Seller.create({
      name,
      email,
      password: securePassword,
      number,
      address,
    });
    res.status(201).json({
      status: "success",
      data: productData,
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
    const securePassword = await bcrypt.compare(password, sellerData.password);
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
export { sellerSignup, SellerLogin, getProduct, addProduct, updateProduct };
