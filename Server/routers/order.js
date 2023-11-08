const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const str = require("../controllers/order");
router.post("/", [verifyAccessToken], str.createOrder);
router.get("/", [verifyAccessToken], str.getOrderUser);
router.get("/admin", [verifyAccessToken, isAdmin], str.getByAdminOrder);
router.patch("/status/:oId", [verifyAccessToken, isAdmin], str.updateStatus);
module.exports = router;
