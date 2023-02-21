import Product from "../models/productModel.js";

const publicData = async (req, res) => {
  try {
    const productData = await Product.find();
    res.status(201).json({
      status: "succes",
      results: Object.getOwnPropertyNames(productData).length,
      data: productData,
    });
  } catch (error) {}
};

const openPublicCart = async (req, res) => {
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

const openPublicWishlist = async (req, res) => {
  try {
    // add product in local storage in the browser and access in the brower without login
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error.message,
    });
  }
};

const addItemWishlist = async (req, res) => {
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
  openPublicCart,
  addItemPublicCart,
  openPublicWishlist,
  addItemWishlist,
};
