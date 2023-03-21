import express from "express";

import {
  customerSignup,
  customerLogin,
  getHistory,
  getSingleCustomer,
} from "../controllers/customerController.js";

import {
  getCustomerCart,
  updateCustomerCart,
  deleteItemCustomerCart,
} from "../controllers/cartController.js";
import {
  getCustomerWishlist,
  updateCustomerWishlist,
  deleteItemCustomerWishlist,
} from "../controllers/wishlistController.js";

// route middleware
const router = express.Router();

// cart route
router.route("/:customerId").get(getSingleCustomer);
router.route("/:customerId/cart").get(getCustomerCart);
router.route("/:customerId/cart/:productId").put(updateCustomerCart);
router
  .route("/:customerId/deletecartitem/:productId")
  .put(deleteItemCustomerCart);

// wishlist route
router.route("/:customerId/wishlist").get(getCustomerWishlist);
router.route("/:customerId/wishlist/:productId").put(updateCustomerWishlist);
router
  .route("/:customerId/deletewishlistitem/:productId")
  .put(deleteItemCustomerWishlist);
// order route
router.route("/:customerId/order").get(getHistory);

// signup route
router.route("/signup").post(customerSignup);

// login route
router.route("/login").post(customerLogin);

// reset password or forget password
router.route("/forgetpassword").post(forgetPassword);

export default router;
