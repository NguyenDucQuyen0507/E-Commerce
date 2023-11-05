/*  !mdbg */
const mongoose = require("mongoose"); // Erase if already required
var bcrypt = require("bcrypt");
const crypto = require("crypto");
const { StringDecoder } = require("string_decoder");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      //email không dc trùng
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      enum: [0, 1],
      default: 0,
      //1 là admin
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
        thumbnail: String,
        title: String,
      },
    ],
    //đẩy các địa chỉ của user vào mảng
    address: {
      type: String,
      // default: [],
    },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    //chứa id của sản phẩm
    isActive: {
      type: Boolean,
      default: false,
    },
    resfresToken: {
      type: String,
    },
    //lưu token của user lúc đăng kí tài khoản
    registerToken: {
      type: String,
    },
    //thời gian thay đổi mk khi gửi yêu cầu từ email
    passwordChangAt: {
      type: String,
    },
    //Lưu token khi người dùng gửi email
    passwordResetToken: {
      type: String,
    },
    //thời gian của token khi người dùng check emal quá lâu
    passwordResetExpires: {
      type: String,
    },
    //tg hết hạn token
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  //mã hóa password trước khi lưu
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//tọa phương thức kt password
userSchema.methods = {
  //truyền vào đối số của người nhập và đối số trong db để so sánh
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  //tạo reset password
  createPasswordChangeToken: async function () {
    //dùng thư viện crypto có sẵn trong nodejs
    //tạo chuổi token khi quên mật khẩu
    //tạo chuổi có độ dài 32 byte sau đó chuyển nó lại thành hệ cơ số 16 là mỗi byte bieruei diễn bằng 2 ký tự từ 0->9 và A->F để dễ đọc và sử dụng
    const resetToken = await crypto.randomBytes(32).toString("hex");
    //lưu nó vào filed passwordResetToken để xác thưcj thông báo đặt lại mật khẩu khi người dùng cần thay đổi
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    //Hiệu lực của mã token này là 15 phút khi người dùng vào gmail, nếu qua 15 phút mà chwua xác nahanj email thì token đó sẽ hết hạn
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    //trả về lại token để gửi token này đi
    return resetToken;
  },
};
//Export the model
module.exports = mongoose.model("User", userSchema);
