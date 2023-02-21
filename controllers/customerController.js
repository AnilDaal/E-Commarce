import Customer from "../models/customerModel.js";
import bcrypt from "bcrypt";

//customer signup
const customerSignup = async (req, res) => {
  const { name, email, password, number } = req.body;
  if (!email || !password || !name || !number) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Please fill all field" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);
    const customerData = await Customer.create({
      name,
      email,
      password: securePassword,
      number,
    });
    res.status(201).json({
      status: "success",
      results: customerData.length,
      data: customerData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

// customer login
const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customerData = Customer.find({ email });
    if (!customerData) {
      return res.status(401).json({
        status: "failed",
        message: "invailid id ",
      });
    }
    const securePassword = await bcrypt.compare(
      password,
      customerData.password
    );
    if (!securePassword) {
      return res.status(401).json({
        status: "failed",
        message: "invailid password",
      });
    }

    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error.message });
  }
};

// CustomerCart

const addCustomerCart = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Customer.findById(customerId);
    // task: add customer data and update in the cart field
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

const getCustomerCart = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Customer.findById(customerId);
    // get customer cart using customer schema
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const updateCustomerCart = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Customer.findById(customerId);
    // update cart schema using customer schema
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

// Customer Wishlist
const getWishlistCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Customer.findById(customerId);
    //  get wishlist using customer schema
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

const addWishlistCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Customer.findById(customerId);
    // update customer schema and add data in the wishlistcustomer
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

const updateWishlistCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Customer.findById(customerId);
    if (!customerData) {
      // update customer schema add wishlist cart data
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

const getHistory = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerData = await Order.findById(customerId);
    // update order schema and
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

const demo = async (req, res) => {
  const data = await Customer.find();
  res.json(data);
};
export {
  customerSignup,
  customerLogin,
  getCustomerCart,
  addCustomerCart,
  getWishlistCustomer,
  addWishlistCustomer,
  updateCustomerCart,
  updateWishlistCustomer,
  getHistory,
  demo,
};
