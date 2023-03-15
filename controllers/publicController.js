import Product from "../models/productModel.js";
import Wishlist from "../models/wishlistModel.js";
import Cart from "../models/cartModel.js";
import catchAsync from "../utils/catchAsync.js";

const publicData = catchAsync(async (req, res, next) => {
  const productData = await Product.find();
  res.status(201).json({
    status: "succes",
    results: productData.length,
    data: productData,
  });
});
// const getPublicCart = async (req, res,next) => {

//   } catch (error) {res.status(401).json({
//     status: "failed",
//     message: error.message,})
// }};

const addItemPublicCart = catchAsync(async (req, res, next) => {
  // const { customerId, productId } = req.body;
  // const cartData = await Cart.findByIdAndUpdate(
  //   customerId,
  //   {
  //     $push: {
  //       productId,
  //     },
  //   },
  //   { new: true }
  // );
  // res.status(201).json({
  //   status: "success",
  //   data: cartData,
  // });
  res.status(401).json({
    message: "Route not define yet",
  });
});
// const getPublicWishlist = async (req, res,next) => {
//   try {
//     // add product in local storage in the browser and access in the brower without login
//   } catch (error) {
//     res.status(401).json({
//       status: "failed",
//       message: error.message,
//     });
//   }
// };

const addItemPublicWishlist = catchAsync(async (req, res, next) => {
  // const { customerId, productId } = req.body;
  // const wishlistData = await Wishlist.findByIdAndUpdate(
  //   customerId,
  //   {
  //     $push: {
  //       productId,
  //     },
  //   },
  //   { new: true }
  // );
  // res.status(201).json({
  //   status: "success",
  //   data: wishlistData,
  // });
  res.status(401).json({
    message: "Route not define yet",
  });
});

export { publicData, addItemPublicCart, addItemPublicWishlist };
