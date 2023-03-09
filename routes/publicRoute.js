import express from "express";
import {
  publicData,
  addItemPublicCart,
  addItemPublicWishlist,
} from "../controllers/publicController.js";
const router = express.Router();

// public route
router.route("/").get(publicData);

// public cart
router.route("/cart").put(addItemPublicCart);

// public wishlist
router.route("/wishlist").put(addItemPublicWishlist);

export default router;
