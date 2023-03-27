import Admin from "../models/adminModel.js";
import Seller from "../models/sellerModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/email.js";

// Sellers Kyc

const verifyKyc = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const sellerData = await Seller.findByIdAndUpdate(
    sellerId,
    {
      $set: {
        isVerified: true,
      },
    },
    { new: true, runValidators: false }
  );
  if (!sellerData) {
    return next(new AppError("No Seller found with this Id", 401));
  }
  const message = "Congratulation you are verified";
  await sendEmail({
    email: sellerData.email,
    subject: "You are verify please login your account",
    message,
  });
  res.status(201).json({
    status: "success",
    data: sellerData,
  });
});

// admin login

const adminSignup = catchAsync(async (req, res, next) => {
  const { email, password, name, confirmPassword } = req.body;
  if (!email || !password || !name || !confirmPassword) {
    return next(new AppError("Please Enter All field", 401));
  }
  const adminData = new Admin({
    email,
    password,
    confirmPassword,
    name,
  });
  await adminData.save();
  const token = jwt.sign(
    { id: adminData._id, role: adminData.roles },
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

const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter email or password", 400));
  }
  const adminData = await Admin.findOne({ email }).select("+password");
  if (
    !adminData ||
    !(await adminData.correctPassword(password, adminData.password))
  ) {
    return next(new AppError("invalid email or password", 401));
  }
  const token = jwt.sign(
    { id: adminData._id, role: adminData.roles },
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

const updateAdmin = catchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;
  if (password) {
    return next(new AppError("this route not for password update", 401));
  }
  const adminId = req.user._id;
  if (!adminId) {
    return next("Please Login or Signup", 401);
  }
  const adminData = await Admin.findByIdAndUpdate(
    adminId,
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
    data: adminData,
  });
});

const updateAdminPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  if (!currentPassword || !password || !confirmPassword) {
    return next(
      new AppError(
        `Please enter all filed: currentPassword , password , confirmPassword `,
        401
      )
    );
  }
  const adminId = req.user._id;
  if (!adminId) {
    return next(new AppError("Please Login or Signup", 401));
  }
  const adminData = await Admin.findOne(adminId).select("+password");
  if (!(await adminData.correctPassword(currentPassword, adminData.password))) {
    return next(new AppError("Please Enter Correct Password", 401));
  }
  adminData.password = password;
  adminData.confirmPassword = confirmPassword;
  await adminData.save();
  res.status(201).json({
    status: "success",
    data: adminData,
  });
});
const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter email ", 401));
  }
  // check user existed or not
  const adminData = await Admin.findOne({ email });
  if (!adminData) {
    return next(new AppError("User not found with this id", 404));
  }
  // 3) Create token and add in the data base
  const resetToken = adminData.createPasswordReseoken();
  // 4) validateBeforeSave:false
  await adminData.save({ validateBeforeSave: false });
  // 5) send mail
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/admin/resetPassword/${resetToken}`;
  const message = `forget your password \n  passwordConfirm to:${resetURL}.If you din't forget your password please ignore this email!`;

  try {
    await sendEmail({
      email,
      subject: "Your password reset token(valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    adminData.passwordResetToken = undefined;
    adminData.passwordResetExpires = undefined;
    await adminData.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
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
  const adminData = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!adminData) {
    return next(new AppError("Token was expire or invalid ", 401));
  }
  // check user existed or not
  if (!adminData) {
    return next(new AppError("User not found with this id", 404));
  }
  adminData.password = password;
  adminData.confirmPassword = confirmPassword;
  adminData.passwordResetToken = undefined;
  adminData.passwordResetExpires = undefined;
  await adminData.save();
  // 3) update password update

  // 4) Signin user
  const token = jwt.sign(
    { id: adminData._id, role: adminData.roles },
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

export {
  adminSignup,
  adminLogin,
  updateAdmin,
  updateAdminPassword,
  verifyKyc,
  resetPassword,
  forgetPassword,
};
