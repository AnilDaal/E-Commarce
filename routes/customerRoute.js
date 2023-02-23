import express from "express";

import {
  customerSignup,
  customerLogin,
  getCustomerCart,
  updateCustomerCart,
  getHistory,
  getCustomer,
  getAllCustomer,
} from "../controllers/customerController.js";

import {
  getWishlistCustomer,
  updateWishlistCustomer,
  addWishlistCustomer,
} from "../controllers/wishlistController.js";

// route middleware
const router = express.Router();

// cart route
router.route("/:customerId/cart").get(getCustomerCart).post(updateCustomerCart);

// wishlist route
router
  .route("/:customerId/wishlist")
  .get(getWishlistCustomer)
  .put(updateWishlistCustomer);
router.route("/:customerId/wishlist/:productId").post(addWishlistCustomer);
// order route
router.route("/:customerId/order").get(getHistory);

// signup route
router.route("/signup").post(customerSignup);

// login route
router.route("/login").post(customerLogin);

router.route("/:customerId").get(getCustomer);

router.route("/").get(getAllCustomer);

export default router;
