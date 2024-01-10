const Order = require("../models/order");
const User = require("../models/users");
const Product = require("../models/products");
const Coupon = require("../models/coupon");

const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

// const createOrder = asyncHandler(async (req, res, next) => {
//   const { id } = req.user;
//   //lấy coupon
//   const { coupon } = req.body;
//   //lấy giỏ hàng từ id của người đó
//   const userCart = await User.findById(id)
//     .select("cart")
//     .populate("cart.product", "title price");
//   //Lưu các thông tin trong giỏ hàng user và các trường cảu order
//   const products = userCart?.cart?.map((el) => ({
//     product: el.product._id,
//     counts: el.quantity,
//     color: el.color,
//   }));
//   //tính tổng tiền
//   let total = userCart?.cart?.reduce(
//     (sum, el) => el.product.price * el.quantity + sum,
//     0
//   );
//   const createData = {
//     products: products,
//     total: total,
//     //lưu id của người mua
//     orderBy: id,
//   };
//   //tính giảm giá nếu có discount
//   //làm trong đến hàng nghìn gần nhất 1253 => 1000
//   if (coupon) {
//     //tìm objectId của coupon đó
//     const selectedCoupon = await Coupon.findById(coupon);
//     total =
//       Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
//         1000 || total;
//     createData.total = total;
//     //tạo một trường rồi gán id của coupon vào
//     createData.coupon = coupon;
//   }
//   console.log("total: ", total);
//   //h mới lưu vào db của order
//   //phải lưu vào các field đúng với trong Order
//   const rs = await Order.create(createData);
//   return res.json({
//     success: rs ? true : false,
//     rs: rs ? rs : "Something went wrong",
//     // userCart: userCart,
//   });
// });

const createOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { products, total, address, status } = req.body;
  for (const productSold of products) {
    const soldId = productSold.product._id;
    const quantity = productSold.quantity;
    await Product.findByIdAndUpdate(
      soldId,
      {
        $inc: { quantity: -quantity, sold: quantity },
      },
      { new: true }
    );
  }
  if (address) {
    //Nếu có địa chỉ thì cập nhật đía chỉ và reset giỏ hàng về [] nếu đã thanh toán thành công.
    await User.findByIdAndUpdate(id, { address, cart: [] }, { new: true });
  }
  const data = {
    products,
    total,
    orderBy: id,
  };
  if (status) {
    data.status = status;
  }
  const rs = await Order.create(data);
  return res.json({
    success: rs ? true : false,
    rs: rs ? rs : "Something went wrong",
  });
});
//làm phần update status cho đơn hàng
const updateStatus = asyncHandler(async (req, res) => {
  const { oId } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing status");
  const response = await Order.findByIdAndUpdate(
    oId,
    { status: status },
    { new: true }
  ).populate("products.product", "price");
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Something went wrong",
  });
});
const getAllOrder = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const exculdeFields = ["limit", "sort", "page", "field"];
  exculdeFields.forEach((item) => delete queries[item]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formatedQueries = JSON.parse(queryString);
  const startDay = req.query.startDate
    ? new Date(`${req.query.startDate}T00:00:00.000Z`)
    : null;
  const endDay = req.query.endDate
    ? new Date(`${req.query.endDate}T23:59:59.999Z`)
    : null;
  const findDay = {};
  if (startDay && endDay) {
    findDay.createdAt = {
      $gte: new Date(startDay),
      $lte: new Date(endDay),
    };
  }
  const query = { ...formatedQueries };
  const dayQuery = { ...findDay };
  let qr = {};
  mongoose.set("debug", true);
  if (startDay && endDay) {
    qr = dayQuery;
  } else {
    qr = query;
  }
  let queryCommand = Order.find(qr).populate(
    "orderBy",
    "firstName lastName mobile"
  );

  //*Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //* Field Limiting là lấy các trường mình cần lấy
  if (req.query.field) {
    const field = req.query.field.split(",").join(" ");
    //lấy giá trị value của key đó
    queryCommand = queryCommand.select(field);
  }

  //* pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  try {
    const response = await queryCommand.exec();
    //đếm có bao nhiêu kq
    const counts = await Order.find(qr).countDocuments();
    return res.status(200).json({
      counts,
      success: response ? true : false,
      orders: response ? response : "Cannot get product",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
//làm phần get đơn hàng cho chính nó cho đơn hàng
const getOrderUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const queries = { ...req.query };
  const exculdeFields = ["limit", "sort", "page", "field"];
  exculdeFields.forEach((item) => delete queries[item]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formatedQueries = JSON.parse(queryString);
  console.log(formatedQueries);
  // //*Filtering
  // if (queries?.title)
  //   formatedQueries.title = { $regex: queries.title, $options: "i" };
  // if (queries?.category) {
  //   formatedQueries.category = { $regex: queries.category, $options: "i" };
  // }
  // // tìm kiếm theo nhiều color
  // let colorQueryObject = {};
  // if (queries?.color) {
  //   delete formatedQueries.color;
  //   const colorArr = queries.color?.split(",");
  //   const colorQuery = colorArr.map((el) => ({
  //     color: { $regex: el, $options: "i" },
  //   }));
  //   colorQueryObject = { $or: colorQuery };
  // }

  //tìm kiếm theo nhìu trường
  // let searchProducts = {};
  // if (queries?.q) {
  //   delete formatedQueries.q;
  //   const orConditions = [
  //     { title: { $regex: queries.q, $options: "i" } },
  //     { brand: { $regex: queries.q, $options: "i" } },
  //     { catego: { $regex: queries.q, $options: "i" } },
  //     { color: { $regex: queries.q, $options: "i" } },
  //   ];
  //   searchProducts = { $or: orConditions };
  // }
  // const generalQuery = {
  //   ...formatedQueries,
  //   ...colorQueryObject,
  //   ...searchProducts,
  // };

  const qr = { ...formatedQueries, orderBy: id };
  //tìm kiếm theo orderBy là tìm tất cả sp của id đó.
  let queryCommand = Order.find(qr);
  //*Sorting
  // => acd,vds => [acd,vds] => acd,vds
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //* Field Limiting là lấy các trường mình cần lấy
  if (req.query.field) {
    const field = req.query.field.split(",").join(" ");
    //lấy giá trị value của key đó
    queryCommand = queryCommand.select(field);
  }
  //* pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  try {
    const response = await queryCommand.exec();
    //đếm có bao nhiêu kq
    const counts = await Order.find(qr).countDocuments();
    return res.status(200).json({
      counts,
      success: response ? true : false,
      orders: response ? response : "Cannot get product",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

//làm phần get đơn hàng cho admin
const getByAdminOrder = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Something went wrong",
  });
});
const deleteOrder = asyncHandler(async (req, res) => {
  const { orId } = req.params;
  const deleteOrder = await Order.findByIdAndDelete(orId);
  return res.status(200).json({
    success: deleteOrder ? true : false,
    mes: deleteOrder ? "Delete successful" : "Cannot delete Order",
  });
});
module.exports = {
  createOrder,
  updateStatus,
  getOrderUser,
  getAllOrder,
  getByAdminOrder,
  deleteOrder,
};
