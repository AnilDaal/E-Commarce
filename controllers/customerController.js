import Customer from "../models/customerModel.js";
import { addCustomerCart } from "../controllers/cartController.js";
import { addCustomerWishlist } from "../controllers/wishlistController.js";
import bcrypt from "bcrypt";
import catchAsync from "../utils/catchAsync.js";

//customer signup
const customerSignup = catchAsync(async (req, res) => {
  const { name, email, password, number } = req.body;
  if (!email || !password || !name || !number) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Please fill all field" });
  }
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
});

// customer login
const customerLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const customerData = Customer.find({ email });
  if (!customerData) {
    return res.status(401).json({
      status: "failed",
      message: "invailid id ",
    });
  }
  const securePassword = await bcrypt.compare(password, customerData.password);
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
});

// get history
const getHistory = catchAsync(async (req, res) => {
  const customerId = req.params.id;
  const customerData = await Order.findById(customerId);
  // update order schema and
  if (!customerData) {
    return res.status(401).json({ status: "failed", data: customerData });
  }
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});

export { customerSignup, customerLogin, getHistory };
