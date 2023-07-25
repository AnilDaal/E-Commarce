import express from "express";
import {
  adminLogin,
  verifyKyc,
  adminSignup,
  updateAdmin,
  updateAdminPassword,
  resetPassword,
  forgetPassword,
} from "../controllers/adminController.js";
import { authUser, restrictTo } from "../controllers/authController.js";

const router = express.Router();

// adminlogin

router.route("/login").post(adminLogin);
router.route("/signup").post(adminSignup);
router.route("/updateAdmin").patch(authUser, restrictTo("admin"), updateAdmin);
router.patch(
  "/resetAdminPassward/:token",
  authUser,
  restrictTo("admin"),
  resetPassword
);
router.patch(
  "/forgetAdminPassward/:token",
  authUser,
  restrictTo("admin"),
  forgetPassword
);
router
  .route("/updateAdminPassword")
  .patch(authUser, restrictTo("admin"), updateAdminPassword);

// sellers Controler
router
  .route("/seller/:sellerId")
  .patch(authUser, restrictTo("admin"), verifyKyc);

export default router;
