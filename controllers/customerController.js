import Customer from "../models/customerModel.js";
import { addCustomerCart } from "../controllers/cartController.js";
import { addCustomerWishlist } from "../controllers/wishlistController.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import Review from "../models/reviewModel.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

//customer signup
const customerSignup = catchAsync(async (req, res, next) => {
  const { email, password, name, confirmPassword } = req.body;
  if (!email || !password || !name || !confirmPassword) {
    return next(new AppError("Please Enter All field", 401));
  }
  console.log("dikkat");
  const customerData = await Customer.create({
    email,
    password,
    name,
    confirmPassword,
  });
  // create cart and wishlist
  await addCustomerCart(customerData._id);
  await addCustomerWishlist(customerData._id);
  const token = jwt.sign(
    { id: customerData._id, role: customerData.roles },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.status(200).json({
    status: "success",
    token,
  });
});

const customerLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter Email or Password", 401));
  }
  const customerData = await Customer.findOne({ email }).select("+password");
  if (
    !customerData ||
    !(await customerData.correctPassword(password, customerData.password))
  ) {
    return next(new AppError("email or password not match", 401));
  }
  const token = jwt.sign(
    { id: customerData._id, role: customerData.roles },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.status(200).json({
    status: "success",
    token,
  });
});

const getAllCustomer = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  if (req.query.page) {
    const totalSeller = await Customer.countDocuments();
    if (skip > totalSeller) {
      return next(new AppError("page does not exist ", 401));
    }
  }
  const customerData = await Customer.find();
  res.status(201).json({
    status: "success",
    results: customerData.length,
    data: customerData,
  });
});

const getSingleCustomer = catchAsync(async (req, res, next) => {
  const customerId = req.params.customerId;
  const customerData = await Customer.findById(customerId);
  if (!customerData) {
    return new AppError(`No Customer found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});

const deleteCustomer = catchAsync(async (req, res, next) => {
  const customerId = req.params.customerId;
  const customerData = await Customer.findByIdAndUpdate(
    customerId,
    {
      $set: {
        accountActive: false,
      },
    },
    { new: true }
  );
  if (!customerData) {
    return new AppError(`No Customer found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const customerData = await Customer.findOne({ email });
  if (!customerData) {
    return next(new AppError("User not found with this id", 404));
  }
  // 2) Generate the random reset token
  const resetToken = customerData.createPasswordResetToken();
  // validateBeforeSave: flase
  await customerData.save({ validateBeforeSave: false });
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
    customerData.passwordResetToken = undefined;
    customerData.passwordResetExpires = undefined;
    await customerData.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later! or Use .io domain in gmail",
        500
      )
    );
  }
};

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
  const customerData = await Customer.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!customerData) {
    return next(new AppError("Token was expire or invalid", 404));
  }
  customerData.password = password;
  customerData.confirmPassword = confirmPassword;
  customerData.passwordResetToken = undefined;
  customerData.passwordResetExpires = undefined;
  await customerData.save();
  // 3) update password update

  // 4) Signin user
  const token = jwt.sign(
    { id: customerData._id, role: customerData.roles },
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

const updateCustomer = catchAsync(async (req, res, next) => {
  const { name, address, password } = req.body;
  if (password) {
    return next(new AppError("this route not for password update", 401));
  }
  const customerId = req.user._id;
  if (!customerId) {
    return next(new AppError("Please Login or Signup", 401));
  }
  // use email for verification
  const customerData = await Customer.findByIdAndUpdate(
    customerId,
    {
      $set: {
        name,
        address,
      },
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});

const updateCustomerPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  if (!currentPassword || !password || !confirmPassword) {
    return next(
      new AppError(
        `Please enter all filed: currentPassword , password , confirmPassword `,
        401
      )
    );
  }
  const customerId = req.user._id;
  if (!customerId) {
    return next(new AppError("Please Login or Signup", 401));
  }
  const customerData = await Customer.findOne(customerId).select("+password");
  if (
    !(await customerData.correctPassword(
      currentPassword,
      customerData.password
    ))
  ) {
    return next(new AppError("Please Enter Correct Password", 401));
  }
  customerData.password = password;
  customerData.confirmPassword = confirmPassword;
  await customerData.save();
  res.status(201).json({
    status: "success",
    data: customerData,
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const product = req.params.productId;
  const { desc, rating } = req.body;
  if (!rating) {
    return next(new AppError("add product rating is common", 401));
  }
  const customerId = req.user._id;
  if (!customerId) {
    return next(new AppError("Please Login or Signup", 401));
  }
  const reviewData = await Review.create({
    customerId,
    desc,
    rating,
    product,
  });
  res.status(201).json({
    status: "success",
    data: reviewData,
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const reviewData = await Review.find({ productId });
  res.status(201).json({
    status: "success",
    results: reviewData.length,
    data: reviewData,
  });
});

export {
  customerSignup,
  customerLogin,
  getSingleCustomer,
  getAllCustomer,
  deleteCustomer,
  updateCustomer,
  updateCustomerPassword,
  resetPassword,
  forgetPassword,
  createReview,
  getReview,
};
