const Product = require("../models/products");
const asyncHandler = require("express-async-handler");
const data = require("../../data/data2.json");
const dataCategory = require("../../data/cate_brand");
const category = require("../models/productCategory");
const slugify = require("slugify");

const fn = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 100) + " ",
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
    //Đầu tiên nó .match là nó sẽ tách số ra thành string ("ádfgh1234567 => "1","2","3","4","5","6","7"), sau đó ta .join('') thành 1 string "1234567", Phương thức Number bao bên ngoài để gán nó thánh kiểu Number (1234567), cuối cùng là chia cho 100 là dể loại bỏ 2 số sau cùng
    category: product?.category[1],
    //số lương mình random từ 0 tớ i 1000
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    color: product?.varients?.find((el) => el.label === "Color")?.varients[0],
    thumb: product?.images[0],
    totalRatings: 0,
  });
};
//insert hết tất cả vào model Product
const insertProduct = asyncHandler(async (req, res, next) => {
  const promises = [];
  for (let product of data) {
    promises.push(fn(product));
  }
  //nghĩa là nó phải đợi tất cả phải hoàn thành ní mới thực hiện phương thức tiếp theo
  await Promise.all(promises);
  return res.json("Done");
});
//insert category
const fn2 = async (cate) => {
  await category.create({
    title: cate?.cate,
    brand: cate?.brand,
    image: cate?.image,
  });
};
const insertCategory = asyncHandler(async (req, res, next) => {
  const promises = [];
  for (let cate of dataCategory) {
    promises.push(fn2(cate));
  }
  //nghĩa là nó phải đợi tất cả phải hoàn thành ní mới thực hiện phương thức tiếp theo
  await Promise.all(promises);
  return res.json("Done");
});
module.exports = {
  insertProduct,
  insertCategory,
};
