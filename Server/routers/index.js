const userRouter = require("./user");
const productRouter = require("./product");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategories");
const blogRouter = require("./blog");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");
const insertRouter = require("./insertData");

const { notFound, errHandler } = require("../middlewares/errHandler");
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/productCategory", productCategoryRouter);
  app.use("/api/blogCategory", blogCategoryRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/insert", insertRouter);

  //* Nếu dùng middleware thì 2 thằng này mới hoạt động
  //* dùng try catch thì không
  //nếu không có api nào có đường dãn như thế thì nó sẽ chạy xuống dưới
  app.use(notFound);
  //Còn nếu có đường dẫn api mà trong api xảy ra lỗi thì nó sẽ bắt ở đây
  app.use(errHandler);
};
module.exports = initRouter;
