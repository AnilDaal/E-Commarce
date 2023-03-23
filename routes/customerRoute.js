import express from "express";

import {
  customerSignup,
  customerLogin,
  getHistory,
  getSingleCustomer,
  getAllCustomer,
  updateCustomer,
  updateCustomerPassword,
  resetPassword,
  forgetPassword,
  deleteCustomer,
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
import { authUser, restrictTo } from "../controllers/authController.js";

// route middleware
const router = express.Router();

// reset password or forget password
router
  .route("/forgetCustomerpassword")
  .post(authUser, restrictTo("customer"), forgetPassword);
router.post(
  "/resetCustomerPassword/:token",
  authUser,
  restrictTo("customer"),
  resetPassword
);
// cart route
router
  .route("/:customerId")
  .get(authUser, restrictTo("admin", "customer"), getSingleCustomer);
router
  .route("/:customerId/cart")
  .get(authUser, restrictTo("customer"), getCustomerCart);
router
  .route("/:customerId/cart/:productId")
  .put(authUser, restrictTo("customer"), updateCustomerCart);
router
  .route("/:customerId/deletecartitem/:productId")
  .put(authUser, restrictTo("customer"), deleteItemCustomerCart);

// wishlist route
router
  .route("/:customerId/wishlist")
  .get(authUser, restrictTo("customer"), getCustomerWishlist);
router
  .route("/:customerId/wishlist/:productId")
  .put(authUser, restrictTo("customer"), updateCustomerWishlist);
router
  .route("/:customerId/deletewishlistitem/:productId")
  .put(authUser, restrictTo("customer"), deleteItemCustomerWishlist);
// order route
router
  .route("/:customerId/order")
  .get(authUser, restrictTo("customer"), getHistory);

// signup route
router.route("/signup").post(customerSignup);

// login route
router.route("/login").post(customerLogin);

router.post(
  "/updateCustomerPassword",
  authUser,
  restrictTo("customer"),
  updateCustomerPassword
);
router
  .route("/")
  .put(authUser, restrictTo("customer"), updateCustomer)
  .get(authUser, restrictTo("admin"), getAllCustomer)
  .delete(authUser, restrictTo("admin"), deleteCustomer);
export default router;
