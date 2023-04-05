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
import { productQuantity } from "../controllers/productController.js";

import {
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
// route middleware
const router = express.Router();

// reset password or forget password
router.post("/forgetCustomerPassword", forgetPassword);
router.post("/resetCustomerPassword/:token", resetPassword);

// address routes
router
  .route("/customerAddress")
  .get(authUser, restrictTo("customer"), getAddress)
  .post(authUser, restrictTo("customer"), addAddress);

router
  .route("/customerAddress/:addressId")
  .patch(authUser, restrictTo("customer"), updateAddress)
  .delete(authUser, restrictTo("customer"), deleteAddress);

//check product availble or not

router.post(
  "/productQuantity",
  authUser,
  restrictTo("customer"),
  productQuantity
);

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
  .patch(authUser, restrictTo("customer"), updateCustomerCart);
router
  .route("/deleteCartProduct/:productId")
  .patch(authUser, restrictTo("customer"), deleteItemCustomerCart);

// wishlist route
router
  .route("/customerWishlist")
  .get(authUser, restrictTo("customer"), getCustomerWishlist);
router
  .route("/customerWishlist/:productId")
  .patch(authUser, restrictTo("customer"), updateCustomerWishlist);
router
  .route("/deleteWishlistProduct/:productId")
  .patch(authUser, restrictTo("customer"), deleteItemCustomerWishlist);

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
  .patch(authUser, restrictTo("customer"), updateCustomer)
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
