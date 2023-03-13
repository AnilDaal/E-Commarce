import express from "express";
import {
  adminLogin,
  getAllCustomer,
  getSingleCustomer,
  getAllSeller,
  getSingleSeller,
  deleteCustomer,
  deleteSeller,
  verifyKyc,
  adminSignup,
} from "../controllers/adminController.js";

const router = express.Router();

// adminlogin

router.route("/login").post(adminLogin);
router.route("/signup").post(adminSignup);

// sellers Controler
router.route("/seller").get(getAllSeller);
router
  .route("/seller/:sellerId/")
  .get(getSingleSeller)
  .put(verifyKyc)
  .delete(deleteSeller);

// customer Controle
router.route("/customer").get(getAllCustomer);
router
  .route("/customer/:customerId")
  .get(getSingleCustomer)
  .delete(deleteCustomer);

export default router;
