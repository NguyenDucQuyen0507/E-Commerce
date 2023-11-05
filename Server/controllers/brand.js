const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res, next) => {
  const response = await Brand.create(req.body);
  return res.json({
    success: response ? true : false,
    createBrand: response ? response : "Cannot create Brand",
  });
});
const getBrands = asyncHandler(async (req, res, next) => {
  //mình chỉ lấy title và _id
  const response = await Brand.find().select("title _id");
  return res.json({
    success: response ? true : false,
    getBrand: response ? response : "Cannot get Brand",
  });
});
const updateBrand = asyncHandler(async (req, res, next) => {
  const { bId } = req.params;
  const data = req.body;
  const response = await Brand.findByIdAndUpdate(bId, data, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateBrand: response ? response : "Cannot update Brand",
  });
});
const deleteBrand = asyncHandler(async (req, res, next) => {
  const { bId } = req.params;
  const response = await Brand.findByIdAndDelete(bId);
  return res.json({
    success: response ? true : false,
    deleteBrand: response ? response : "Cannot delete Brand",
  });
});
module.exports = {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
