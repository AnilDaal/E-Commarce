import express from "express";
import {
  publicData,
  openPublicCart,
  addItemPublicCart,
  openPublicWishlist,
  addItemPublicWishlist,
} from "../controllers/publicController.js";
const router = express.Router();

// public route
router.route("/").get(publicData);

// public cart
router.route("/cart").get(openPublicCart).push(addItemPublicCart);

// public wishlist
router.route("/wishlist").get(openPublicWishlist).push(addItemPublicWishlist);
