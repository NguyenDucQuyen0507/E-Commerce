const productCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createProductCategory = asyncHandler(async (req, res, next) => {
  const response = await productCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    createCategoryProduct: response
      ? response
      : "Cannot create categoryProduct",
  });
});
const getProductCategory = asyncHandler(async (req, res, next) => {
  //mình chỉ lấy title và _id
  const response = await productCategory.find();
  return res.json({
    success: response ? true : false,
    getCategoryProduct: response ? response : "Cannot get categoryProduct",
  });
});
const updateProductCategory = asyncHandler(async (req, res, next) => {
  const { pcId } = req.params;
  const data = req.body;
  const response = await productCategory.findByIdAndUpdate(pcId, data, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCategoryProduct: response
      ? response
      : "Cannot update categoryProduct",
  });
});
const deleteProductCategory = asyncHandler(async (req, res, next) => {
  const { pcId } = req.params;
  const response = await productCategory.findByIdAndDelete(pcId);
  return res.json({
    success: response ? true : false,
    deleteCategoryProduct: response
      ? response
      : "Cannot delete categoryProduct",
  });
});
module.exports = {
  createProductCategory,
  getProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
