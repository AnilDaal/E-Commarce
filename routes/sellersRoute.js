import express from "express";
import multer from "multer";
import { storage } from "../utils/multer.js";

const upload = multer({ storage });

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

// deleteSeller

router.delete(
  "/deleteSeller/:sellerId",
  authUser,
  restrictTo("admin", "seller"),
  deleteSeller
);

// product route

router.patch(
  "/resetSellerPassword/:token",
  authUser,
  restrictTo("seller"),
  resetPassword
);
router
  .route("/forgetSellerPassword")
  .patch(authUser, restrictTo("seller"), forgetPassword);

router
  .route("/products")
  .get(authUser, restrictTo("seller", "admin"), getSellerProduct)
  .post(authUser, restrictTo("seller", "admin"), addSellerProduct);

router
  .route("/:sellerId")
  .get(authUser, restrictTo("seller", "admin"), getSingleSeller)
  .patch(authUser, restrictTo("seller"), updateSellerPassword);

router
  .route("/product/:productId")
  .patch(authUser, restrictTo("seller", "admin"), updateProduct)
  .delete(authUser, restrictTo("seller", "admin"), deleteProduct);

// signup route
router.route("/signup").post(
  upload.fields([
    { name: "adharcard", maxCount: 2 },
    { name: "pancard", maxCount: 2 },
  ]),
  SellerSignup
);

// login route
router.route("/login").post(SellerLogin);
router
  .route("/")
  .get(authUser, restrictTo("admin"), getAllSeller)
  .patch(authUser, restrictTo("seller"), updateSeller);

// kyc of sellers

export default router;
