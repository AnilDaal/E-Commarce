import express from "express";
import {
  publicData,
  getPublicCart,
  addItemPublicCart,
  getPublicWishlist,
  addItemPublicWishlist,
} from "../controllers/publicController.js";
const router = express.Router();

// public route
router.route("/").get(publicData);

// public cart
router.route("/cart").get(getPublicCart).put(addItemPublicCart);

// public wishlist
router.route("/wishlist").get(getPublicWishlist).put(addItemPublicWishlist);

export default router;
