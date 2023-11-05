const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res, next) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing input");
  const response = await Blog.create(req.body);
  return res.json({
    success: response ? true : false,
    createBlog: response ? response : "Cannot create Blog",
  });
});
const getBlogs = asyncHandler(async (req, res, next) => {
  const response = await Blog.find();
  return res.json({
    success: response ? true : false,
    getBlog: response ? response : "Cannot get Blog",
  });
});
const updateBlog = asyncHandler(async (req, res, next) => {
  const { bId } = req.params;
  const data = req.body;
  if (Object.keys(data).length === 0) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(bId, data, { new: true });
  return res.json({
    success: response ? true : false,
    updateBlog: response ? response : "Cannot update Blog",
  });
});
/* 
khi người dùng like một blog thì
  1 check xem người đó đã dislike hay chưa => bỏ dislike
  2 check xem người đó đã like hay chưa => bỏ like / thêm like
  push là thêm tài liệu mơi vào array rỗng
  pull kéo dữ liệu có trong db ra ngoài
*/
const likeBlog = asyncHandler(async (req, res, next) => {
  //lấy id của user đang xem blog
  const { id } = req.user;
  //nhập id từ params
  const { bId } = req.params;
  if (!bId) throw new Error("Missing input");
  //tìm bid trong db
  const blog = await Blog.findById(bId);
  //tìm xem trong phần disLikes có id user nào đã dislike trong product đó chưa
  const alreadyDislikes = blog?.disLikes?.find((el) => el.toString() === id);
  //nếu có id user nào mà đã disLikes thì ta sẽ bỏ disLike đó đi
  if (alreadyDislikes) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $pull: { disLikes: id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  //h ta kt người đó có like hay không
  const isLiked = blog?.likes?.find((el) => el.toString() === id);
  //nếu trả về một object nghĩa là thằng đó đã like rồi
  //nếu đã like thì khi người dùng click cái nữa thì xóa người dúng đó khỏi mảng likes
  //$pull là nó sẽ xóa theo dk, dk ở đây là mảng likes và xóa id trong mảng like đó
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $pull: { likes: id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    //còn nếu nó không trả về object nào tìm thấy thì nó sẽ add user đó vào mảng likes
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $push: { likes: id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});
const disLikeBlog = asyncHandler(async (req, res, next) => {
  //lấy id của user đang xem blog
  const { id } = req.user;
  //nhập id từ params
  const { bId } = req.params;
  if (!bId) throw new Error("Missing input");
  //tìm bid trong db
  const blog = await Blog.findById(bId);
  //tìm xem trong phần disLikes có id user nào đã dislike trong product đó chưa
  const alreadyLikes = blog?.likes?.find((el) => el.toString() === id);
  //nếu có id user nào mà đã likes thì ta sẽ bỏ likes đó đi
  if (alreadyLikes) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $pull: { likes: id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  //h ta kt người đó có disLike hay không
  const isDisLiked = blog?.disLikes?.find((el) => el.toString() === id);
  //nếu trả về một object nghĩa là thằng đó đã like rồi
  //nếu đã like thì khi người dùng click cái nữa thì xóa người dúng đó khỏi mảng likes
  //$pull là nó sẽ xóa theo dk, dk ở đây là mảng likes và xóa id trong mảng like đó
  if (isDisLiked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $pull: { disLikes: id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    //còn nếu nó không trả về object nào tìm thấy thì nó sẽ add user đó vào mảng likes
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $push: { disLikes: id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});
//get byId blog
//khi get thei Id thì ta mới lấy những user cụ thể
//populate có 2 tham số, tham số 1 là path (đườg dẫn tới field cần lấy) tham số 2 là những field mà ta muốn hiển thị lên
//các thông số của user mà ta không muốn hiện
// const excludedFields =
//   "-resfresToken -role -password -createdAt -updatedAt -passwordChangAt";
const getBlog = asyncHandler(async (req, res) => {
  const { bId } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bId,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    .populate("likes", "firstName lastName")
    .populate("disLikes", "firstName lastName");
  return res.json({
    success: blog ? true : false,
    rs: blog ? blog : "Cannot find blog",
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bId } = req.params;
  const blog = await Blog.findByIdAndDelete(bId);
  return res.json({
    success: blog ? true : false,
    deleteBlog: blog ? blog : "Cannot delete blog",
  });
});
module.exports = {
  createBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  disLikeBlog,
  getBlog,
  deleteBlog,
};
