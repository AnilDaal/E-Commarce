import Customer from "../models/customerModel.js";
import { addCustomerCart } from "../controllers/cartController.js";
import { addCustomerWishlist } from "../controllers/wishlistController.js";
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
    // create cart and wishlist
    addCustomerCart(customerData._id);
    addCustomerWishlist(customerData._id);

    res.status(201).json({
      status: "success",
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

// get history
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
    res.status(501).json({ status: "failed", message: error.message });
  }
};

export { customerSignup, customerLogin, getHistory };
