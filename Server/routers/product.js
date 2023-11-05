const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const str = require("../controllers/product");
const uploader = require("../config/cloudinary.config");
//chỉ có quyền admin mới tạo dc sp
router.post(
  "/",
  [verifyAccessToken, isAdmin],
  uploader.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  str.createProducts
);
router.get("/", str.getProducts);
router.patch("/ratings", verifyAccessToken, str.ratings);

router.patch(
  "/uploadimage/:pid",
  [verifyAccessToken, isAdmin],
  uploader.array("images", 10),
  str.uploadImageProducts
);
router.get("/:pid", str.getProduct);
router.patch(
  "/varient/:pid",
  [verifyAccessToken, isAdmin],
  uploader.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  str.varientProducts
);
router.patch(
  "/:pid",
  [verifyAccessToken, isAdmin],
  uploader.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  str.updateProduct
);

router.delete("/:pid", [verifyAccessToken, isAdmin], str.deleteProduct);
module.exports = router;
// Lưu ý ta nên đưua mấy thằng dùng params ở dưới những thằng còn lại "/:pid"
