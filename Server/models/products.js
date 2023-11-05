const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      //loại bỏ khoảng trắng giữa 2 đầu
      trim: true,
    },
    //đồ điện từ => slug =>do-dien-tu
    slug: {
      type: String,
      required: true,
      unique: true,
      //viết thường
      lowercase: true,
    },
    description: {
      type: Array,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      // type: mongoose.Types.ObjectId,
      // ref: "Category",
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    thumb: {
      type: String,
      // require: true,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      //dựa theo dữ liệu cho trước
      // enum: ["Black", "Grown", "Red"],
      // required: true,
    },
    //đánh giá
    ratings: [
      {
        star: Number,
        //người đánh giá
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: String,
        updateAt: {
          type: Date,
        },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    varients: [
      {
        color: String,
        price: Number,
        thumb: String,
        images: Array,
        title: String,
        sku: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
