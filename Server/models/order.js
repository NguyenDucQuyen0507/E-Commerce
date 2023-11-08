const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
        thumbnail: String,
        title: String,
      },
    ],
    status: {
      type: String,
      default: "Processing",
      enum: ["Cancelled", "Processing", "Successed"],
    },
    //tổng tiền sản phẩm
    total: {
      type: Number,
    },
    //sản phẩm này thuộc loại giảm giá nào
    // coupon: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Coupon",
    // },
    //được mua bởi ai
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
