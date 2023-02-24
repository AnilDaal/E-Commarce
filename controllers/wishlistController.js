import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// Customer Wishlist
const getCustomerWishlist = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const wishlistData = await Wishlist.findById(customerId);
    //  get wishlist using customer schema
    if (!wishlistData) {
      return res.status(401).json({ status: "failed", data: wishlistData });
    }
    res.status(201).json({
      status: "success",
      data: wishlistData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

const addCustomerWishlist = async (customerId) => {
  try {
    const wishlistData = await Wishlist.create({
      _id: customerId,
    });
    // update customer schema and add data in the wishlistcustomer
    if (!wishlistData) {
      return { status: "failed", data: wishlistData };
    }
    // const addWishlist = await wishlistData.create({
    //   product: title,
    //   userid,
    // });
    return {
      status: "success",
      data: wishlistData,
    };
  } catch (error) {
    return { status: "failed", message: error.message };
  }
};

const updateCustomerWishlist = async (req, res) => {
  const { customerId, productId } = req.params;
  try {
    const wishlistData = await Wishlist.findByIdAndUpdate(
      customerId,
      {
        $push: {
          product: productId,
        },
      },
      {
        new: true,
      }
    );
    if (!wishlistData) {
      // update customer schema add wishlist cart data
      return res.status(401).json({ status: "failed", data: wishlistData });
    }
    res.status(201).json({
      status: "success",
      data: wishlistData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

export { getCustomerWishlist, addCustomerWishlist, updateCustomerWishlist };
