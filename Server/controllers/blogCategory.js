const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res, next) => {
  const response = await BlogCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    createBlogCategory: response ? response : "Cannot create Blogcategory",
  });
});
const getBlogCategorys = asyncHandler(async (req, res, next) => {
  //mình chỉ lấy title và _id
  const response = await BlogCategory.find().select("title _id");
  return res.json({
    success: response ? true : false,
    getBlogCategory: response ? response : "Cannot get Blogcategory",
  });
});
const updateBlogCategory = asyncHandler(async (req, res, next) => {
  const { bcId } = req.params;
  const data = req.body;
  const response = await BlogCategory.findByIdAndUpdate(bcId, data, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateBlogCategory: response ? response : "Cannot update Blogcategory",
  });
});
const deleteBlogCategory = asyncHandler(async (req, res, next) => {
  const { bcId } = req.params;
  const response = await BlogCategory.findByIdAndDelete(bcId);
  return res.json({
    success: response ? true : false,
    deleteBlogCategory: response ? response : "Cannot delete Blogcategory",
  });
});
module.exports = {
  createBlogCategory,
  getBlogCategorys,
  updateBlogCategory,
  deleteBlogCategory,
};
