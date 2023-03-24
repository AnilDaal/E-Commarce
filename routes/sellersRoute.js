import express from "express";

import {
  SellerSignup,
  SellerLogin,
  getSellerProduct,
  deleteSeller,
  getAllSeller,
  getSingleSeller,
  resetPassword,
  forgetPassword,
  updateSellerPassword,
  updateSeller,
} from "../controllers/sellersController.js";
import {
  addSellerProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authUser, restrictTo } from "../controllers/authController.js";
// route middleware
const router = express.Router();

// product route

router.put(
  "/resetSellerPassword/:token",
  authUser,
  restrictTo("seller"),
  resetPassword
);
router
  .route("/forgetSellerPassword")
  .put(authUser, restrictTo("seller"), forgetPassword);

router
  .route("/products")
  .get(authUser, restrictTo("seller", "admin"), getSellerProduct)
  .post(authUser, restrictTo("seller", "admin"), addSellerProduct);

router
  .route("/:sellerId")
  .get(authUser, restrictTo("seller", "admin"), getSingleSeller)
  .put(authUser, restrictTo("seller"), updateSellerPassword);

router
  .route("/product/:productId")
  .put(authUser, restrictTo("seller", "admin"), updateProduct)
  .delete(authUser, restrictTo("seller", "admin"), deleteProduct);

// signup route
router.route("/signup").post(SellerSignup);

// login route
router.route("/login").post(SellerLogin);
router
  .route("/")
  .get(authUser, restrictTo("admin"), getAllSeller)
  .put(authUser, restrictTo("seller"), updateSeller)
  .delete(authUser, restrictTo("seller", "admin"), deleteSeller);

// kyc of sellers

export default router;
