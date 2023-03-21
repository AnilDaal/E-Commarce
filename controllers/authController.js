import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import Admin from "../models/adminModel.js";

const authUser = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    let tokenData = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // if admin delete
    const freshData = await Admin.findById(tokenData.id);
    if (!freshData) {
      return next(
        new AppError(
          "The admin belonging to this token does no longer exist",
          401
        )
      );
    }
    // if admin update password
    // if (freshData.changePassword(tokenData.iat)) {
    //   return next(new AppError("Admin recently changed password", 401));
    // }
    req.user = freshData;
  } else {
    return next(new AppError("token not found", 401));
  }
  next();
});

// seller auth
// const authSeller = catchAsync(async (req, res, next) => {
//   let token = req.headers.authorization.startsWith("Bearer")
//     ? req.headers.authorization.split(" ")[1]
//     : null;
//   if (token) {
//     let sellerData = await promisify(jwt.verify)(
//       token,
//       process.env.SECRET_KEY_SEL
//     );
//     // if admin delete
//     const freshData = await Seller.findById(sellerData.id);
//     if (!freshData) {
//       return new AppError(
//         "The seller belonging to this token does no longer exist",
//         401
//       );
//     }
//     // if admin change password
//     // if (freshData.changePassword(sellerData.iat)) {
//     //   return next(new AppError("Seller recently changed password", 401));
//     // }
//     req.seller = sellerData.id;
//   } else {
//     return next(new AppError("token not found", 401));
//   }
//   next();
// });

// // customer auth

// const authCustomer = catchAsync(async (req, res, next) => {
//   let token = req.headers.authorization.startsWith("Bearer")
//     ? req.headers.authorization.split(" ")[1]
//     : null;
//   if (token) {
//     let customerData = await promisify(jwt.verify)(
//       token,
//       process.env.SECRET_KEY_CUS
//     );
//     // if admin delete
//     const freshData = await Seller.findById(customerData.id);
//     if (!freshData) {
//       return new AppError(
//         "The customer belonging to this token does no longer exist",
//         401
//       );
//     }
//     // if password changed
//     // if (freshData.changePassword(customerData.iat)) {
//     //   return next(new AppError("Customer recently changed password", 401));
//     // }
//     req.id = customerData.id;
//   } else {
//     return next(new AppError("token not found", 401));
//   }
//   next();
// })

const restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action ", 403)
      );
    }
  };
};

export { authUser, restrictTo };
