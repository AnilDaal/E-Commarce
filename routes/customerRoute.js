import express from "express";

import {
  customerSignup,
  customerLogin,
  getSingleCustomer,
  getAllCustomer,
  updateCustomer,
  updateCustomerPassword,
  resetPassword,
  forgetPassword,
  deleteCustomer,
  createReview,
  getReview,
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
import { createOrder, orderHistory } from "../controllers/orderController.js";
import { authUser, restrictTo } from "../controllers/authController.js";

// route middleware
const router = express.Router();

// reset password or forget password
router.post("/forgetCustomerPassword", forgetPassword);
router.post("/resetCustomerPassword/:token", resetPassword);

// create order
router
  .route("/customerOrder")
  .post(authUser, restrictTo("customer"), createOrder)
  .get(authUser, restrictTo("customer"), orderHistory);

// cart route

router
  .route("/customerCart")
  .get(authUser, restrictTo("customer"), getCustomerCart);
router
  .route("/customerCart/:productId")
  .put(authUser, restrictTo("customer"), updateCustomerCart);
router
  .route("/deleteCartProduct/:productId")
  .put(authUser, restrictTo("customer"), deleteItemCustomerCart);

// wishlist route
router
  .route("/customerWishlist")
  .get(authUser, restrictTo("customer"), getCustomerWishlist);
router
  .route("/customerWishlist/:productId")
  .put(authUser, restrictTo("customer"), updateCustomerWishlist);
router
  .route("/deleteWishlistProduct/:productId")
  .put(authUser, restrictTo("customer"), deleteItemCustomerWishlist);

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
  .get(authUser, restrictTo("admin"), getAllCustomer);
router
  .route("/:customerId")
  .delete(authUser, restrictTo("admin", "customer"), deleteCustomer)
  .get(authUser, restrictTo("admin", "customer"), getSingleCustomer);
// review route

router
  .route("/:productId/customerReview")
  .post(authUser, restrictTo("customer"), createReview)
  .get(getReview);
export default router;
