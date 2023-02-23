import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// Customer Wishlist
const getWishlistCustomer = async (req, res) => {
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

const addWishlistCustomer = async (req, res) => {
  const customerId = req.params;
  const { productId } = req.body;
  try {
    const wishlistData = await Wishlist.create({
      _id: customerId,
      product: productId,
    });
    // update customer schema and add data in the wishlistcustomer
    if (!customerData) {
      return res.status(401).json({ status: "failed", data: customerData });
    }
    console.log(customerId);
    // const addWishlist = await customerData.create({
    //   product: title,
    //   userid,
    // });
    res.status(201).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

const updateWishlistCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const wishlistData = await Customer.findById(customerId);
    if (!wishlistData) {
      // update customer schema add wishlist cart data
      return res.status(401).json({ status: "failed", data: customerData });
    }
    res.status(201).json({
      status: "success",
      data: wishlistData,
    });
  } catch (error) {
    return res.status(501).json({ status: "failed", message: error.message });
  }
};

export { getWishlistCustomer, addWishlistCustomer, updateWishlistCustomer };
