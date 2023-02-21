import express from "express";

import {
  customerSignup,
  customerLogin,
  getCustomerCart,
  getWishlistCustomer,
  updateWishlistCustomer,
  updateCustomerCart,
  getHistory,
  demo,
} from "../controllers/customerController.js";

// route middleware
const router = express.Router();

// cart route
router.route("/:id/cart").get(getCustomerCart).post(updateCustomerCart);

// wishlist route
router
  .route("/:id/wishlist")
  .get(getWishlistCustomer)
  .post(updateWishlistCustomer);

// order route
router.route("/:id/order").get(getHistory);

// signup route
router.route("/signup").post(customerSignup);

// login route
router.route("/login").post(customerLogin);

router.route("/").get(demo);

export default router;
