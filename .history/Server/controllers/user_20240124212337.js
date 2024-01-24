const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const { users } = require("../utils/contant");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../utils/sendMail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const createUser = asyncHandler(async (req, res) => {
  const response = await User.create(users);
  return res.status(200).json({
    success: true,
    User: response ? response : "Something went wrong",
  });
});
// const reisgter = async (req, res) => {
//   try {
//     const { email, password, firstName, lastName } = req.body;
//     if (!email || !password || !firstName || !lastName) {
//       res.status(406).send({ msg: "Missing input " });
//       return;
//     } else {
//       const response = await User.create(req.body);
//       return res.status(200).json({ response });
//     }
//   } catch (error) {
//     console.log("err", error);
//     res.sendStatus(500);
//   }
// };

// const reisgter = asyncHandler(async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;
//   if (!email || !password || !firstName || !lastName)
//     return res.status(400).json({
//       success: false,
//       mess: "Missing inputs",
//     });
//   //kt email đã tồn tại hay chưa
//   const user = await User.findOne({ email });
//   if (user) {
//     throw new Error("Email has exists!");
//   } else {
//     const newUsers = await User.create(req.body);
//     return res.status(200).json({
//       success: newUsers ? true : false,
//       mess: newUsers ? "Login success, please login." : "Something went wrong",
//       User: newUsers,
//     });
//   }
// });
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !firstName || !lastName || !mobile)
    return res.status(400).json({
      success: false,
      mess: "Missing inputs",
    });
  //kt email đã tồn tại hay chưa trước khi đăng kí
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("Email has existed");
  } else {
    //lưu tạm vào cookie
    //tọa token ngẫu nhiên giành riêng cho phần xác thực bằng email
    //mục đích của truyền params là randomToken là để đối chíu với token được lưu trong cookie, nếu trùng nhau thì hoàn tất đk
    //Đây chỉ là ta lưu ở cookie post men chứ không phải lưu ở cookie trên trình duyệt.
    const randomToken = uuidv4();
    // res.cookie(
    //   "dataRegister",
    //   { ...req.body, randomToken },
    //   {
    //     httpOnly: true,
    //     maxAge: 15 * 60 * 1000,
    //     // số miligiay trong 15 phút là hết hạn
    //   }
    // );
    //* Ta sẽ lưu tạm ở db chứ không lưu dưới cookies
    const newUser = await User.create({
      email: btoa(email) + "@" + randomToken,
      password,
      firstName,
      lastName,
      mobile,
    });
    if (newUser) {
      const html = `<h1>Code your is: </h1> <br /> <blockquote>${randomToken}
      </blockquote>`;
      await sendMail({
        email,
        html,
        subject: "Confirm register account in Digital",
      });
    }
    //sau khoảng tg nào đó mà nó vẫn là dạng email đó là xóa nó khỏi db
    setTimeout(async () => {
      await User.deleteOne({ email: btoa(email) + "@" + randomToken });
    }, [300000]);

    // const html = `Xin vui lòng click vào link dưới đây để hoàn tất đăng kí. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/finalregister/${randomToken}>Click here</a>`;
    return res.json({
      success: newUser ? true : false,
      mes: newUser
        ? "Please check your email to active account"
        : "Something went wrong",
    });
  }
});
const finalRegister = asyncHandler(async (req, res) => {
  // const cookie = req.cookies;
  const { token } = req.params;
  const notActiveEmail = await User.findOne({ email: new RegExp(`${token}`) });
  //Nếu có email thì ta sẽ cắt nó ra thành 2 phần và chuyển nó về dạng ban đầu ("uyen@q2") => ["uyen":"q2"]
  if (notActiveEmail) {
    notActiveEmail.email = atob(notActiveEmail?.email?.split("@")[0]);
    //lưu nó vào db
    notActiveEmail.save();
  }
  return res.json({
    success: notActiveEmail ? true : false,
    mes: notActiveEmail ? "Register successful " : "Something went wrong",
  });
  //lấy token theo route mình đã tạo /:token
  // if (!cookie || cookie?.dataRegister?.randomToken !== token) {
  //   res.clearCookie("dataRegister");
  //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  // }
  // const newUsers = await User.create({
  //   email: cookie?.dataRegister?.email,
  //   password: cookie?.dataRegister?.password,
  //   mobile: cookie?.dataRegister?.mobile,
  //   firstName: cookie?.dataRegister?.firstName,
  //   lastName: cookie?.dataRegister?.lastName,
  // });
  // res.clearCookie("dataRegister");
  // if (newUsers) {
  //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  // } else {
  //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  // }
  // return res.status(200).json({
  //   success: newUsers ? true : false,
  //   mess: newUsers ? "Login success, please login." : "Something went wrong",
  //   User: newUsers,
  // });
  // return res.json({
  //   success: true,
  //   cookie: cookie,
  //   token,
  // });
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mess: "Missing inputs",
    });
  //kt email có khớp không và password có khớp trong db hay không
  const response = await User.findOne({ email });
  //phải chờ nó kt có đúng mk hay không mới trả về kq
  //password là đối số của người nhập vào và server lấy xuống xử lý
  if (response && (await response.isCorrectPassword(password))) {
    // const isCorrectPassword = await bcrypt.compare(password, response.password);
    // if (response && isCorrectPassword)
    //trước khi trả về data ta phải dấu đi password và roles
    const { password, role, resfresToken, ...usersData } = response.toObject();
    //ép kiểu nó về object
    const accessToken = generateAccessToken(response._id, response.role);
    const newRefreshToken = generateRefreshToken(response._id);
    //Lưu refreshToken vào db
    await User.findByIdAndUpdate(
      response._id,
      { resfresToken: newRefreshToken },
      { new: true }
    );
    //Lưu refreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // '7d' số miligiay trong 7 ngày
    });
    return res.status(200).json({
      success: response ? true : false,
      mess: response ? "Login success" : "Login failure",
      accessToken,
      //không cần lấy newRefreshToken ra
      // newRefreshToken,
      userData: usersData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  // vì sao ta lại lấy .user
  //Dadaud tiên ở middleware ta sẽ kt verifyToken được đăt trước khi gọi getCurrent trong router là nó phải đi qua middleware trước. Mà trong mà middleware khi kt thành công thì nó sẽ gán decoded cho req.user. decode là trả về user mà token dc xác thực
  //Sau đó ở này ta lấy id từ .user ra và tìm nó rồi trả về
  const { id } = req.user;
  // console.log("id", id);
  //Và khi lấy ra ta cungc koh lấy trường refresToken, role, password
  const user = await User.findById(id)
    .select("-resfresToken -password ")
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "thumb title price ",
      },
    })
    .populate("wishlist", "title thumb price color");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //lấy token từ cookie
  const cookie = req.cookies;
  //kt có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookie");
  //check token hợp lệ hay không
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  //kt có khớp trong db hay không
  const response = await User.findOne({
    _id: rs.id,
    resfresToken: cookie.refreshToken,
  });
  //tạo lại accessToken mới
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response.id, response.role)
      : "Refresh Token not match",
  });

  // jwt.verify(
  //   cookie.refreshToken,
  //   process.env.JWT_SECRET,
  //   async (err, decode) => {
  //     if (err) throw new Error("Invalid refresh token");
  //     //check kt token có khớp với token trong db
  //     console.log("decode1", decode);
  //     const response = await User.findOne({
  //       _id: decode.id,
  //       resfresToken: req.cookies.refreshToken,
  //     });
  //     console.log("reponse", response);
  //     // trả về một acctoken mới
  //     return res.status(200).json({
  //       success: response ? true : false,
  //       newAccessToken: response
  //         ? generateAccessToken(response._id, response.role)
  //         : "Refresh token not match",
  //     });
  //   }
  // );
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refreshToken in cookie");
  //Xóa resfreshToken ở db
  await User.findOneAndUpdate(
    //tìm kiếm where
    { resfresToken: cookie.refreshToken },
    //khi có rồi thì set nó về  ''
    { resfresToken: " " },
    //lưu thay đổi
    { new: true }
  );
  //Xóa refreshToken ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    //tăng tính bảo mật
    httpOnly: true,
    secure: true,
  });
  //phải trả về return
  return res.status(200).json({
    success: true,
    mes: "Logout in done",
  });
});
//Reset password
const forgotPassword = asyncHandler(async (req, res) => {
  //Lấy email mà client gửi lên từ ô input
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  //Nếu có email mà email không hợp lệ hoặc chưa dk
  if (!user) throw new Error("User not found");
  //Tạo resetToken trong model user và gọi nó ra ở đây để tạo token
  //chờ nó tạo xong mới có được resetToken
  const resetToken = await user.createPasswordChangeToken();
  console.log("resetToken", resetToken);
  //sau đó mới lưu dữ liệu vào db để lưu các trường trong createPasswordChangeToken
  await user.save();

  //làm phần gửi gmail
  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;
  const data = {
    //nhận email của người gửi và đoạn html
    email,
    html,
    subject: "Forgot password",
  };
  //truyền data vào file sendMail
  const rs = await sendMail(data);
  //reuturn về kq
  return res.status(200).json({
    success: rs.response.includes("OK") ? true : false,
    mes: rs.response.includes("OK")
      ? "Check your mail please."
      : "Something went wrong, please try again",
  });
});
//làm phần kt token cho đường dẫn reset-password
const resetPassword = asyncHandler(async (req, res) => {
  //lấy token từ url, và lấy password của user mà user đã trả về cho server
  const { token, password } = req.body;
  if (!password || !token) throw new Error("Missing input");
  //hash token đó về dạng giống như passwordResetToken trong model user. Mục đích là để 2 kiểu dữ liệu giống nhau để so sánh chúng
  const passwordResetToken = crypto
    .createHash("sha256")
    //cập nhật lại token khi bị hash
    .update(token)
    .digest("hex");
  //đối chíu với passwordResetToken trong user email có bằng với passwordResetToken mới tạo hay không , kiểm tra luôn thời gian mình đã cho là 15 phút cho eamil đó có lớn hơn thời gian hiện tại hay không
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  //cập nhật lại password
  user.password = password;
  //set passwordResetToken về không có giá trị
  user.passwordResetToken = undefined;
  //set lại thời gian thay đổi mk về không có giá trị
  user.passwordChangAt = Date.now();
  //set lại thời gian hết hạn của token
  user.passwordResetExpires = undefined;
  //lưu sự thay đổi đó
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Update password success" : "Something went wrong",
  });
});

//get tất cả user
const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  console.log(queries);
  //tách các trường đặc biệt ra khỏi query
  const exculdeFields = ["limit", "sort", "page", "field"];
  //xóa các trường đặc biệt trong exculdeFields
  //nó chỉ xóa các trường trong queries chứ nó không xóa hết trong req.query
  exculdeFields.forEach((item) => delete queries[item]);
  // console.log("querie", queries);
  //Format lại các operator cho đúng cú pháp mongoose là kiểu json
  //chuyển nó về kiểu json là vì khi mình thực hiện với các phương thức như : regex, gte,... trước khi thực hiện thì mình phải chuyển nó về jSON.
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  //ta sẽ thêm tiền tô $ vào trước các chữ ss như "gte,gt,lte,lt" =>$gte
  const formatedQueries = JSON.parse(queryString);
  //Khi thực hiện xong thì mình phải truyền kiểu JSON đó về lại kiểu String để mình có thể truy vấn các trường bên trong nó
  //*Filtering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  let searchQuery = {};
  if (queries?.q) {
    //phải xóa giá trị q đi ở trước đó
    delete formatedQueries.q;
    const orConditions = [
      //req.query.q là value của người dùng nhập vào
      { firstName: { $regex: req.query.q, $options: "i" } },
      { lastName: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
    ];
    searchQuery = { $or: orConditions };
  }
  console.log(searchQuery);
  const e = { ...formatedQueries, ...searchQuery };
  let queryCommand = User.find(e);
  //*Sorting
  // => acd,vds => [acd,vds] => acd,vds
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //* Field Limiting là lấy các trường mình cần lấy
  if (req.query.field) {
    const field = req.query.field.split(",").join(" ");
    queryCommand = queryCommand.select(field);
  }
  //* pagination
  //limit là số object được gọi khi mỗi lần gọi api.
  const page = +req.query.page || 1;
  //nếu client không nhập giá trị page thì nó sẽ lấy mặc định là 1
  const limit = +req.query.limit || process.env.REACT_APP_LIMIT_PRODUCTS;
  //giói hạn phần từ trả về mỗi trang, nếu client koh nhập thì nó sẽ lấy là 2
  const skip = (page - 1) * limit;
  //là số object cần bỏ qua, ở đây sau khi tính toán nó sẽ là 0 nghĩa là nó sẽ lấy object từ vị trí đầu tiên trở đi
  queryCommand.skip(skip).limit(limit);
  //truy vấn bỏ qua vị trị thứ 0 là lấy từ object đầu tiên, limit là lấy 2 phần tử đầu tiên
  try {
    const response = await queryCommand.exec();
    //đếm có bao nhiêu kq
    const counts = await User.find(e).countDocuments();
    return res.status(200).json({
      counts,
      success: response ? true : false,
      Users: response ? response : "Cannot get product",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
//delete user
const deleteUsers = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    mess: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
  // try {
  //   const { id } = req.params;
  //   User.findByIdAndDelete(id).then((result) => {
  //     res.send(result);
  //     return;
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.sendStatus(500);
  //   return;
  // }
});
//update chỉ có user đó mới update được của nó, không update user khác đưuọc
const updateUsers = asyncHandler(async (req, res) => {
  //lấy id từ user đã được kt token hợp lệ và trả về đúng user đó (là chỉ update chính nó)
  const { id } = req.user;
  //chỉ cho phép sửa những thằng này
  const { firstName, lastName, email, mobile, address } = req.body;
  //lấy tất cả giá trị vừa lấy gán vào biến data
  const data = { firstName, lastName, email, mobile, address };
  if (req.file) {
    //gán giá trị ảnh vào avatar (Vì trong router ta dùng single là chỉ đẩy lên 1 ảnh nên ta chỉ .file)
    data.avatar = req.file.path;
  }
  //kt có id hay không hoặc object của body có đang rổng hay không
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(id, data, {
    new: true,
  }).select("-password -role -resfresToken");
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? "Updated" : "Something went wrong",
  });
});
//update tất cả user by admin
const updateUsersByAdmin = asyncHandler(async (req, res) => {
  //lấy id từ user bất kì để chỉnh sửa
  const { uid } = req.params;
  //kt có id hay không hoặc object của body có đang rổng hay không
  if (!uid || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -resfresToken");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? response : "Something went wrong",
  });
});
//UpdateAddress
const updateUsersAddress = asyncHandler(async (req, res) => {
  //nó chỉ update address của chính nó
  const { id } = req.user;
  const { address } = req.body;
  if (!address) throw new Error("Missing input");
  //ta sẽ push địa chỉ của client khi nhâp vào trường address
  //ta dùng toán tử $addToSet để kt trong mảng có địa chỉ đó chưa, nếu chưa có thì thêm vào còn có rồi thì không thêm
  const response = await User.findByIdAndUpdate(
    id,
    { $addToSet: { address: address } },
    {
      new: true,
    }
  );
  return res.status(200).json({
    success: response ? true : false,
    updateAddress: response ? response : "Something went wrong",
  });
});
//thêm đơn hàng vào cart
const updateUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  //Ta sét mặc định khi ta thêm vào giỏ hàng thì quantity sẽ là 1
  const { pid, quantity = 1, color, price, thumbnail, title } = req.body;
  if (!pid || !color) throw new Error("Missing inputs");
  //tìm id của user đó và lấy ra giỏ hàng
  const userCart = await User.findById(id).select("cart");
  //tìm kiếm id của sp đó có trong giỏ hàng của user đó không
  //Ta dùng find để tìm kiếm trong giỏ hàng của User đó có  tồn tại id sp và color của sp đó không. Nếu có thì nó trả về đúng 1 giá trị tm
  const alreadyCart = await userCart?.cart?.find(
    (cart) => cart.product.toString() === pid && cart.color === color
  );
  console.log("cart", alreadyCart);
  //Nếu đã tim dc sp có id và màu của nó
  if (alreadyCart) {
    //nếu ta muốn cập nhật số lượng
    const response = await User.updateOne(
      {
        cart: { $elemMatch: alreadyCart },
      },
      {
        $set: {
          "cart.$.quantity": quantity,
          "cart.$.price": price,
          "cart.$.thumbnail": thumbnail,
          "cart.$.title": title,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Updated" : "Something went wrong",
    });
  }
  //Nếu koh tìm thấy id hay màu đó trong giỏ hàng thì nó sẽ thêm vào
  else {
    const response = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          cart: { product: pid, quantity, color, price, thumbnail, title },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Updated your cart" : "Something went wrong",
    });
  }
});
const removeProductCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pid, color } = req.params;
  if (!pid || !color) throw new Error("Missing id of product");
  //tìm id của user đó và lấy ra giỏ hàng
  const userCart = await User.findById(id).select("cart");
  //tìm kiếm id của sp đó có trong giỏ hàng của user đó không
  const alreadyCart = await userCart?.cart?.find(
    (cart) => cart.product.toString() === pid && cart.color === color
  );
  if (!alreadyCart)
    return res.status(200).json({
      success: true,
      mes: "Updated your cart",
    });
  const response = await User.findByIdAndUpdate(
    id,
    {
      $pull: { cart: { product: pid, color } },
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Removed your cart" : "Something went wrong",
  });
});

const wishLishUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pid } = req.params;
  //tìm ra id của người dùng đó truowcsc khi so sánh wishlish của họ
  const user = await User.findById(id);
  const alreadyWishLish = user.wishlist?.find((el) => el.toString() === pid);
  if (alreadyWishLish) {
    //xóa id đó ra khỏi danh sách wishlist của người dùng đó.
    const response = await User.findByIdAndUpdate(
      id,
      {
        $pull: { wishlist: pid },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your wishlish" : "Updated failed wishlist",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      id,
      {
        $push: { wishlist: pid },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your wishlish" : "Updated failed wishlist",
    });
  }
});
module.exports = {
  createUser,
  register,
  finalRegister,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUsers,
  updateUsers,
  updateUsersByAdmin,
  updateUsersAddress,
  updateUserCart,
  removeProductCart,
  wishLishUser,
};
