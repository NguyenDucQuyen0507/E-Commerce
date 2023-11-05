const Order = require("../models/order");
const User = require("../models/users");
const Coupon = require("../models/coupon");

const asyncHandler = require("express-async-handler");

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
  const { products, total, address } = req.body;
  console.log(address);
  if (address) {
    //Nếu có địa chỉ thì cập nhật đía chỉ và reset giỏ hàng về [] nếu đã thanh toán thành công.
    await User.findByIdAndUpdate(id, { address, cart: [] }, { new: true });
  }
  const rs = await Order.create({ products, total, orderBy: id });
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
//làm phần get đơn hàng cho chính nó cho đơn hàng
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.user;
  //khi lưu trong order thì id là tên của đơn hàng đó
  //nên ta sẽ tìm dựa trên orderBy là id của người mua đơn hàng đos
  const response = await Order.find({ orderBy: id });
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Something went wrong",
  });
});
//làm phần get đơn hàng cho admin
const getByAdminOrder = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Something went wrong",
  });
});
module.exports = {
  createOrder,
  updateStatus,
  getOrder,
  getByAdminOrder,
};
