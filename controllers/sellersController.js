import Seller from "../models/sellerModel.js";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";
import ApiFeatures from "../utils/apiFeatures.js";

// seller signup
const SellerSignup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    number,
    address,
    pancard,
    confirmPassword,
    adharcard,
  } = req.body;
  if (
    !email ||
    !pancard ||
    !adharcard ||
    !name ||
    !number ||
    !address ||
    !confirmPassword
  ) {
    return next(new AppError("Please fill all field", 401));
  }
  const sellerData = await Seller.create({
    name,
    email,
    pancard,
    adharcard,
    number,
    address,
    password,
    confirmPassword,
  });

  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// seller login
const SellerLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please fill all field", 401));
  }
  const sellerData = await Seller.findOne({ email }).select("+password");
  if (
    !sellerData ||
    !(await sellerData.correctPassword(password, sellerData.password))
  ) {
    return next(new AppError("email or password not match", 401));
  }
  if (!sellerData.isVerified) {
    return next(new AppError("you are not verified till now", 401));
  }
  const token = jwt.sign(
    { id: sellerData._id, role: sellerData.roles },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  res.status(201).json({
    status: "success",
    token,
  });
});
// Sellers Controllers

const getAllSeller = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  if (req.query.page) {
    const totalSeller = await Seller.countDocuments();
    if (skip > totalSeller) {
      return next(new AppError("page does not exist ", 401));
    }
  }
  const sellerData = await Seller.find().skip(skip).limit(limit);
  if (!sellerData) {
    return next(new AppError("no seller found", 400));
  }
  return res.status(201).json({
    status: "success",
    results: sellerData.length,
    data: sellerData,
  });
});

const getSingleSeller = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const sellerData = await Seller.findById(sellerId);

  if (!sellerData) {
    return next(new AppError("No Seller found with this Id", 400));
  }
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

const deleteSeller = catchAsync(async (req, res, next) => {
  const sellerId = req.user._id;
  const sellerData = await Seller.findByIdAndUpdate(
    sellerId,
    {
      $set: {
        accountActive: false,
      },
    },
    { new: true }
  );
  if (!sellerData) {
    return next(new AppError("No Seller found with this Id", 400));
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return next(
      new AppError("Please enter password and confirm password", 401)
    );
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // 2) check user existed or not and token is not expire
  const sellerData = await Seller.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!sellerData) {
    return next(new AppError("Token was expire or invalid", 404));
  }
  sellerData.password = password;
  sellerData.confirmPassword = confirmPassword;
  sellerData.passwordResetToken = undefined;
  sellerData.passwordResetExpires = undefined;
  await sellerData.save();
  // 3) update password update

  // 4) Signin user
  const token = jwt.sign(
    { id: sellerData._id, role: sellerData.roles },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.status(201).json({
    status: "success",
    token,
  });
});

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const sellerData = await Seller.findOne({ email });
  if (!sellerData) {
    return next(new AppError("User not found with this id", 404));
  }
  // 2) Generate the random reset token
  const resetToken = sellerData.createPasswordResetToken();
  // validateBeforeSave: flase
  await sellerData.save({ validateBeforeSave: false });
  // 3) Send email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `forget your password? \n passwordConfirm to:${resetURL}.If you din't forget your password please ignore this email!`;

  try {
    const options = {
      email,
      subject: "your password reset token (valid for 10 min)",
      message,
    };
    await sendEmail(options);

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    sellerData.passwordResetToken = undefined;
    sellerData.passwordResetExpires = undefined;
    await sellerData.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};

const updateSeller = catchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;
  if (password) {
    return next(new AppError("this route not for password update", 401));
  }
  const sellerId = req.user._id;
  if (!sellerId) {
    return next(AppError("Please Login or Signup", 401));
  }
  const sellerData = await Seller.findByIdAndUpdate(
    sellerId,
    {
      $set: {
        email,
        name,
      },
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

const updateSellerPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  const sellerId = req.user._id;
  if (!sellerId) {
    return next("Please Login or Signup", 401);
  }
  const sellerData = await Seller.findById(sellerId).select("+password");
  if (!sellerData.correctPassword(currentPassword, sellerData.password)) {
    return next(new AppError("Please Enter Correct Password", 401));
  }
  sellerData.password = password;
  sellerData.confirmPassword = confirmPassword;
  await sellerData.save();
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

const getSellerProduct = catchAsync(async (req, res, next) => {
  const sellerId = req.user._id;
  // // 1) filtering
  // const queryObj = { ...req.query };
  // const excludeField = ["page", "sort", "limit", "fields"];
  // excludeField.forEach((el) => {
  //   delete queryObj[el];
  // });

  // // 2) advanced filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|lte|gt|le)\b/g, (match) => `$${match}`);
  // let query = Product.find(JSON.parse(queryStr));

  // 4) Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("createdAt");
  // }

  // 3) pagination

  // const page = req.query.page || 1;
  // const limit = req.query.limit || 10;
  // const skip = (page - 1) * limit;
  // let totalProduct;
  // if (req.query.page) {
  //   totalProduct = await Product.find({ sellerId }).countDocuments();
  //   if (skip >= totalProduct) {
  //     return next(new AppError("page does not exist ", 401));
  //   }
  // }
  // query = query.limit(limit).skip(skip);

  // 5) fields

  // if (req.query.fields) {
  //   const fields = fields.split(",").join(" ");
  //   query = query.select(fields);
  // }

  // find the seller using id and after all find the product list in the seller and show all of them
  const totalProduct = await Product.find({ sellerId }).countDocuments();
  let features = new ApiFeatures(Product.find({ sellerId }), req.query)
    .pagination()
    .sort()
    .filter()
    .limitFields()
    .search();
  const productData = await features.query;

  if (!productData) {
    return next(new AppError(" No Product found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    totalProduct,
    filterProduct: productData.length,
    data: productData,
  });
});

export {
  SellerSignup,
  SellerLogin,
  getAllSeller,
  deleteSeller,
  getSellerProduct,
  getSingleSeller,
  updateSeller,
  updateSellerPassword,
  resetPassword,
  forgetPassword,
};
