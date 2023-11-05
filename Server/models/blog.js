const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    //Bài đăng này thuộc danh mục nào
    category: {
      type: String,
      required: true,
      unique: true,
    },
    //số lược xem blog này
    numberViews: {
      type: Number,
      default: 0,
    },
    //nơi lưu những ai like và dislike
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    //ảnh của bài đăng
    image: {
      type: String,
      default:
        "https://c0.wallpaperflare.com/preview/71/610/431/advice-article-background-beverage.jpg",
    },
    //ai là đăng bài đăng
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
