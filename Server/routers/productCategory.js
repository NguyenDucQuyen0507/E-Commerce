const router = require("express").Router();
const { isAdmin, verifyAccessToken } = require("../middlewares/verifyToken");
const str = require("../controllers/productCategory");
router.post("/", [verifyAccessToken, isAdmin], str.createProductCategory);
router.get("/", str.getProductCategory);
router.patch("/:pcId", [verifyAccessToken, isAdmin], str.updateProductCategory);
router.delete(
  "/:pcId",
  [verifyAccessToken, isAdmin],
  str.deleteProductCategory
);

module.exports = router;
