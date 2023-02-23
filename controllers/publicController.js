import Product from "../models/productModel.js";

const publicData = async (req, res) => {
  try {
    const productData = await Product.find();
    res.status(201).json({
      status: "succes",
      results: productData.length,
      data: productData,
    });
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error.message,
    });
  }
};

const getPublicCart = async (req, res) => {
  try {
    // add product from cache memory I will see after
    // const publicCart = await
  } catch (error) {}
};

const addItemPublicCart = async (req, res) => {
  try {
    // add product in local storage in the browser and access in the brower without login
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error.message,
    });
  }
};

const getPublicWishlist = async (req, res) => {
  try {
    // add product in local storage in the browser and access in the brower without login
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error.message,
    });
  }
};

const addItemPublicWishlist = async (req, res) => {
  try {
    // add product in local storage in the browser and access in the brower without login
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error.message,
    });
  }
};

export {
  publicData,
  getPublicCart,
  addItemPublicCart,
  getPublicWishlist,
  addItemPublicWishlist,
};
