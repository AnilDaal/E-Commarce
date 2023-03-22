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
router.route("/updateAdmin").put(authUser, restrictTo("admin"), updateAdmin);
router
  .route("/updateAdminPassword")
  .put(authUser, restrictTo("admin"), updateAdminPassword);

// sellers Controler
router.route("/seller/:sellerId").put(authUser, restrictTo("admin"), verifyKyc);

export default router;
