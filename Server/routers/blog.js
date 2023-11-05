const router = require("express").Router();
const str = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
router.post("/", [verifyAccessToken, isAdmin], str.createBlog);
router.get("/", str.getBlogs);
router.get("/one/:bId", str.getBlog);
router.patch("/likes/:bId", [verifyAccessToken], str.likeBlog);
router.patch("/dis-likes/:bId", [verifyAccessToken], str.disLikeBlog);
router.patch("/:bId", [verifyAccessToken, isAdmin], str.updateBlog);
router.delete("/:bId", [verifyAccessToken, isAdmin], str.deleteBlog);

module.exports = router;
