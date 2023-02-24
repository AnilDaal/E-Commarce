import express from "express";

import {
  getCustomer,
  getAllCustomer,
  customerSignup,
  customerLogin,
  getHistory,
} from "../controllers/customerController.js";

import {
  getCustomerCart,
  updateCustomerCart,
} from "../controllers/cartController.js";
import {
  getCustomerWishlist,
  updateCustomerWishlist,
} from "../controllers/wishlistController.js";

// route middleware
const router = express.Router();

// cart route
router.route("/:customerId/cart").get(getCustomerCart);
router.route("/:customerId/cart/:productId").put(updateCustomerCart);

// wishlist route
router.route("/:customerId/wishlist").get(getCustomerWishlist);
router.route("/:customerId/wishlist/:productId").put(updateCustomerWishlist);
// order route
router.route("/:customerId/order").get(getHistory);

// signup route
router.route("/signup").post(customerSignup);

// login route
router.route("/login").post(customerLogin);

router.route("/:customerId").get(getCustomer);

router.route("/").get(getAllCustomer);

export default router;
