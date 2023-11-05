const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res, next) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing input");
  //ta sẽ lấy ngày cộng với số ngày mà mình muốn nó hết hạn rồi nhân nó với sô giây trong 1 ngày
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.json({
    success: response ? true : false,
    createCoupon: response ? response : "Cannot create Coupon",
  });
});
const getCoupons = asyncHandler(async (req, res, next) => {
  //mình chỉ lấy title và _id
  const response = await Coupon.find().select("-createdAt -updatedAt");
  return res.json({
    success: response ? true : false,
    getCoupon: response ? response : "Cannot get Coupon",
  });
});
const updateCoupon = asyncHandler(async (req, res, next) => {
  const { cId } = req.params;
  const data = req.body;
  if (Object.keys(data).length === 0) throw new Error("Missing input");
  if (data.expiry)
    data.expiry = Date.now() + +data.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cId, data, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCoupon: response ? response : "Cannot update Coupon",
  });
});
const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { cId } = req.params;
  const response = await Coupon.findByIdAndDelete(cId);
  return res.json({
    success: response ? true : false,
    deleteCoupon: response ? response : "Cannot delete Coupon",
  });
});
module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};
