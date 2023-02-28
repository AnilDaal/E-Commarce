import { Admin } from "mongodb";
import Customer from "../models/customerModel";
import SellerKyc from "../models/sellerKycModel";
import Seller from "../models/sellerModel";

// Customer Controller

const getAllCustomer = async (req, res) => {
  try {
    const customerData = await Customer.find();
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      results: customerData.length,
      data: customerData,
    });
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const getSingleCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Customer.findById(customerId);
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      results: customerData,
      data: customerData,
    });
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const customerData = await Customer.findByIdAndDelete(customerId);
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

// Sellers Controllers

const getAllSeller = async (req, res) => {
  try {
    const sellerData = await Seller.find();
    if (!sellerData) {
      return res.status(401).json({ status: "failed", data: sellerData });
    }
    res.status(201).json({
      status: "success",
      results: sellerData.length,
      data: sellerData,
    });
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const getSingleSeller = async (req, res) => {
  const sellerId = req.params.id;
  try {
    const sellerData = await Seller.findById(sellerId);
    if (!sellerData) {
      return res.status(401).json({ status: "failed", data: sellerData });
    }
    res.status(201).json({
      status: "success",
      results: sellerData,
      data: sellerData,
    });
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const deleteSeller = async (req, res) => {
  const sellerId = req.params.sellerId;
  try {
    const sellerData = await Seller.findByIdAndDelete(sellerId);
    res.status(201).json({
      status: "success",
      data: sellerData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

// Sellers Kyc

const varifyKyc = async (req, res) => {
  const sellerId = req.params.sellerId;
  const { isVarified } = req.body;
  try {
    const sellerData = await SellerKyc.findByIdAndUpdate(
      sellerId,
      {
        $set: {
          isVarified,
        },
      },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: sellerData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

// admin login

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminData = await Admin.find({ email });
    if (!adminData) {
      return res.status(401).json({
        status: "failed",
        message: "invailid id ",
      });
    }
    const securePassword = await bcrypt.compare(password, adminData.password);
    if (!securePassword) {
      return res.status(401).json({
        status: "failed",
        message: "invailid password",
      });
    }

    res.status(201).json({
      status: "success",
      data: adminData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

export {
  adminLogin,
  getAllCustomer,
  getSingleCustomer,
  getAllSeller,
  getSingleSeller,
  deleteCustomer,
  deleteSeller,
  varifyKyc,
};
