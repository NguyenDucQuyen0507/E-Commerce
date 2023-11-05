const router = require("express").Router();
const str = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
router.post("/", [verifyAccessToken, isAdmin], str.createBrand);
router.get("/", str.getBrands);
router.patch("/:bId", [verifyAccessToken, isAdmin], str.updateBrand);
router.delete("/:bId", [verifyAccessToken, isAdmin], str.deleteBrand);
module.exports = router;
