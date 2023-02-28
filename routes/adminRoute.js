import express from "express";
import {
  getAllCustomer,
  getSingleCustomer,
  getAllSeller,
  getSingleSeller,
  deleteCustomer,
  deleteSeller,
  varifyKyc,
  adminLogin,
} from "../controllers/adminController.js";

const router = express.Router();

// adminlogin

router.route("/login").post(adminLogin);

// sellers Controle
router.route("/seller").get(getAllSeller);
router
  .route("/seller/:sellerId/")
  .get(getSingleSeller)
  .put(varifyKyc)
  .delete(deleteSeller);

// customer Controle
router.route("/customer").get(getAllCustomer);
router
  .route("/customer/:customerId")
  .get(getSingleCustomer)
  .delete(deleteCustomer);
