const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler((req, res, next) => {
  //kt xem token dc lưu trong headers có bắt đầu bằng chữ "Bearer" hay không
  //headers : {authorization: Bearer token}
  //token ở đây không phải là "token " mà là một đoạn mã hóa token
  if (req.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    //tách chữ "Bearer token" thành mảng bằng khoảng cách và lấy chữ token [1]
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      //trường hợp nó kt token mà lỗi
      if (err)
        return res.status(401).json({
          success: false,
          mes: "Invalid access token",
        });
      console.log("decode:", decoded);
      //gán cho một biến user khi thành công
      //decoded là nó sẽ lấy id và role ở generateAccessToken trong file jwt làm giá trị. decoded là id và role của thằng mà dc cấp token và token đó hợp lệ
      req.user = decoded;
      //   console.log("req.user:", req.user);
      next();
      //next để lấy dữ liệu gán cho req.user truyền đi cho phương thức khác
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Required authorization",
    });
  }
});

//check role
const isAdmin = asyncHandler(async (req, res, next) => {
  //nhận role từ decode đã kt token thành công và trả về role của user đó
  const { role } = req.user;
  if (role !== 1)
    return res.status(401).json({
      success: false,
      mes: "Require admin role",
    });
  //cho phép chạy tới thằng tiếp theo
  next();
});

module.exports = {
  verifyAccessToken,
  isAdmin,
};
