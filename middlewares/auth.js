import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
import Seller from '../models/sellerModel.js';
import Admin from '../models/adminModel.js';

const authAdmin = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (token) {
    let tokenData = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // if admin delete
    const freshData = await Admin.findById(tokenData.id);
    if (!freshData) {
      return new AppError(
        'The admin belonging to this token does no longer exist',
        401
      );
    }
    req.admin = freshData.user;
  } else {
    return next(new AppError('token not fonnd', 401));
  }
  next();
});

// seller auth
const authSeller = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (token) {
    let sellerData = await promisify(jwt.verify)(
      token,
      process.env.SECRET_KEY_SEL
    );
    // if admin delete
    const freshData = await Seller.findById(sellerData.id);
    if (!freshData) {
      return new AppError(
        'The seller belonging to this token does no longer exist',
        401
      );
    }
    req.seller = sellerData.id;
  } else {
    return next(new AppError('token not fonnd', 401));
  }
  next();
});

// customer auth

const authCustomer = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (token) {
    let customerData = await promisify(jwt.verify)(
      token,
      process.env.SECRET_KEY_CUS
    );
    // if admin delete
    const freshData = await Seller.findById(customerData.id);
    if (!freshData) {
      return new AppError(
        'The customer belonging to this token does no longer exist',
        401
      );
    }
    req.customer = customerData.id;
  } else {
    return next(new AppError('token not fonnd', 401));
  }
  next();
});
export { authAdmin, authCustomer, authSeller };
