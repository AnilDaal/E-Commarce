import express from "express";

import {
  sellerSignup,
  SellerLogin,
  getProduct,
  addProduct,
  updateProduct,
} from "../controllers/sellersController.js";

// route middleware
const router = express.Router();

// product route
router.route("/:sellerId/product").get(getProduct).post(addProduct);

router.route("/:sellerId/product/:productId").put(updateProduct);

// signup route
router.route("/signup").post(sellerSignup);

// login route
router.route("/login").post(SellerLogin);

export default router;
