const router = require("express").Router();
const str = require("../controllers/insertData");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
router.post("/", str.insertProduct);
router.post("/cateData", str.insertCategory);

module.exports = router;
