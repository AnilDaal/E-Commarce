import express from "express";
import {
  adminLogin,
  verifyKyc,
  adminSignup,
  updateAdmin,
} from "../controllers/adminController.js";
import { authUser, restrictTo } from "../controllers/authController.js";
import {
  getAllCustomer,
  deleteCustomer,
  getSingleCustomer,
} from "../controllers/customerController.js";
import {
  getAllSeller,
  getSingleSeller,
  deleteSeller,
} from "../controllers/sellersController.js";
import {
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
const router = express.Router();

// adminlogin

router.route("/login").post(adminLogin);
router.route("/signup").post(adminSignup);
router.route("/").put(authUser, updateAdmin);

// sellers Controler
router.route("/seller").get(authUser, getAllSeller);
router
  .route("/seller/:sellerId")
  .get(authUser, getSingleSeller)
  .put(authUser, verifyKyc)
  .delete(authUser, deleteSeller);

// customer Controle
router.route("/customer").get(authUser, getAllCustomer);
router
  .route("/customer/:customerId")
  .get(authUser, getSingleCustomer)
  .delete(authUser, deleteCustomer);

// product route here sellerId is admin id
router
  .route("/:sellerId/product")
  .post(authUser, addProduct)
  .get(authUser, getSingleProduct);

router
  .route("/:sellerId/product/:productId")
  .put(authUser, updateProduct)
  .delete(authUser, deleteProduct);

export default router;
