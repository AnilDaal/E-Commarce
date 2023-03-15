import express from "express";

import {
  SellerSignup,
  SellerLogin,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/sellersController.js";

// route middleware
const router = express.Router();

// product route
router.route("/:sellerId/product").get(getProduct).post(addProduct);

router
  .route("/:sellerId/product/:productId")
  .put(updateProduct)
  .delete(deleteProduct);

// signup route
router.route("/signup").post(SellerSignup);

// login route
router.route("/login").post(SellerLogin);

// kyc of sellers

export default router;
