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
import { authAdmin } from "../middlewares/auth.js";
import {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/sellersController.js";

const router = express.Router();

// adminlogin

router.route("/login").post(adminLogin);
router.route("/signup").post(adminSignup);

// sellers Controler
router.route("/seller").get(authAdmin, getAllSeller);
router
  .route("/seller/:sellerId")
  .get(authAdmin, getSingleSeller)
  .put(authAdmin, verifyKyc)
  .delete(authAdmin, deleteSeller);

// customer Controle
router.route("/customer").get(authAdmin, getAllCustomer);
router
  .route("/customer/:customerId")
  .get(authAdmin, getSingleCustomer)
  .delete(authAdmin, deleteCustomer);

// product route here sellerId is admin id
router
  .route("/:sellerId/product")
  .post(authAdmin, addProduct)
  .get(authAdmin, getProduct);

router
  .route("/:sellerId/product/:productId")
  .put(authAdmin, updateProduct)
  .delete(authAdmin, deleteProduct);

export default router;
