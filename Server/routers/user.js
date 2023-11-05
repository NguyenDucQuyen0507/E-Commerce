const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
// import { reisgter } from "../controllers/user.js";
const ctrl = require("../controllers/user");
router.post("/mock", ctrl.createUser);
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/getCurent", verifyAccessToken, ctrl.getCurrent);
router.post("/refreshToken", ctrl.refreshAccessToken);
//trước khi logout thì phải kt nó có token khi đăng nhập hay chưa
router.get("/logout", ctrl.logout);
router.post("/forgotpassword", ctrl.forgotPassword);
router.patch("/resetpassword", ctrl.resetPassword);
//có quyfen role = "admin" mới được get hết user
router.get("/", [verifyAccessToken, isAdmin], ctrl.getUsers);
//có quyềm role =  "admin" mới dc xóa
router.delete("/:uid", [verifyAccessToken, isAdmin], ctrl.deleteUsers);
//update chính nó
router.patch(
  "/current",
  uploader.single("avatar"),
  [verifyAccessToken],
  ctrl.updateUsers
);
//update địa chỉ của chính nó
router.patch("/address", [verifyAccessToken], ctrl.updateUsersAddress);
//add cart
router.patch("/cart", [verifyAccessToken], ctrl.updateUserCart);
router.delete(
  "/remove-cart/:pid/:color",
  [verifyAccessToken],
  ctrl.removeProductCart
);
//update by admin
router.patch("/:uid", [verifyAccessToken, isAdmin], ctrl.updateUsersByAdmin);
router.patch("/finalregister/:token", ctrl.finalRegister);

module.exports = router;

//Create + Put => body (dấu dữ liệu)
// Get + delete => query (Lộ dữ liệu) ?@gmail.com
