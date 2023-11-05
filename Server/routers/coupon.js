const router = require("express").Router();
const str = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
router.post("/", [verifyAccessToken, isAdmin], str.createCoupon);
router.get("/", str.getCoupons);
router.patch("/:cId", [verifyAccessToken, isAdmin], str.updateCoupon);
router.delete("/:cId", [verifyAccessToken, isAdmin], str.deleteCoupon);
module.exports = router;
