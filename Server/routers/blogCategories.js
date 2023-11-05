const router = require("express").Router();
const { isAdmin, verifyAccessToken } = require("../middlewares/verifyToken");
const str = require("../controllers/blogCategory");
router.post("/", [verifyAccessToken, isAdmin], str.createBlogCategory);
router.get("/", str.getBlogCategorys);
router.patch("/:bcId", [verifyAccessToken, isAdmin], str.updateBlogCategory);
router.delete("/:bcId", [verifyAccessToken, isAdmin], str.deleteBlogCategory);

module.exports = router;
