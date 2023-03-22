import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import Admin from "../models/adminModel.js";
import Seller from "../models/sellerModel.js";
import Customer from "../models/customerModel.js";

const authUser = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    let tokenData = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    console.log(tokenData);
    let freshData;

    if (tokenData.role === "admin") {
      freshData = await Admin.findById(tokenData.id);
      if (!freshData) {
        return next(
          new AppError(
            `The ${tokenData.role} belonging to this token does no longer exist`,
            401
          )
        );
      }
    } else if (tokenData.role === "seller") {
      freshData = await Seller.findById(tokenData.id);
      if (!freshData) {
        return next(
          new AppError(
            `The ${tokenData.role} belonging to this token does no longer exist`,
            401
          )
        );
      }
    } else {
      freshData = await Customer.findById(tokenData.id);
      if (!freshData) {
        return next(
          new AppError(
            `The ${tokenData.role} belonging to this token does no longer exist`,
            401
          )
        );
      }
    }

    // if admin update password
    if (await freshData.changePassword(tokenData.iat)) {
      return next(
        new AppError(`${freshData.roles} recently changed password`, 401)
      );
    }
    req.user = freshData;
  } else {
    return next(new AppError("token not found", 401));
  }
  next();
});

const restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new AppError("You do not have permission to perform this action ", 403)
      );
    }
    next();
  };
};

export { authUser, restrictTo };
