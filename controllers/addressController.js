import Address from "../models/addressModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const addAddress = catchAsync(async (req, res, next) => {
  const customerId = req.user._id;
  const {
    counrty,
    fullName,
    pincode,
    mobileNumber,
    houseNo,
    area,
    landmark,
    city,
    state,
  } = req.body;
  if (!counrty || !mobileNumber || !pincode || !city || !state || !fullName) {
    return next(new AppError("please fill all the fields", 401));
  }
  const addressData = await Address.create({
    counrty,
    fullName,
    pincode,
    customerId,
    mobileNumber,
    houseNo,
    area,
    landmark,
    city,
    state,
  });
  res.status(200).json({
    status: "success",
    data: addressData,
  });
});

const updateAddress = catchAsync(async (req, res, next) => {
  const addressId = req.params.addressId;
  const {
    counrty,
    fullName,
    pincode,
    mobileNumber,
    houseNo,
    area,
    landmark,
    city,
    state,
  } = req.body;
  //   if (!counrty || !mobileNumber || !pincode || !city || !state || !fullName) {
  //     return next(new AppError("please fill all the fields", 401));
  //   }
  const addressData = await Address.findByIdAndUpdate(
    addressId,
    {
      counrty,
      fullName,
      pincode,
      mobileNumber,
      houseNo,
      area,
      landmark,
      city,
      state,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: addressData,
  });
});

const getAddress = catchAsync(async (req, res, next) => {
  const customerId = req.user._id;

  const addressData = await Address.find({ customerId });
  res.status(200).json({
    status: "success",
    results: addressData.length,
    data: addressData,
  });
});

const deleteAddress = catchAsync(async (req, res, next) => {
  const addressId = req.params.addressId;

  await Address.findByIdAndDelete(addressId);
  res.status(200).json({
    status: "success",
    data: null,
  });
});

export { getAddress, addAddress, updateAddress, deleteAddress };
