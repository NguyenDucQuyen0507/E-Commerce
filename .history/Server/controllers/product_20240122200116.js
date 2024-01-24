const Product = require("../models/products");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const createProducts = asyncHandler(async (req, res) => {
  const { title, price, description, brand, category, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  //.path là vì trong files chứa nhìu key mà key path là key lưu đường dẫn ảnh
  // console.log(req.files);
  const images = req?.files?.images?.map((el) => el.path);
  //kt người dùng có nhập các trường vô chưa
  if (!(title && price && description && brand && category && color))
    throw new Error("Missing inputs");
  //ghi đè ảnh mình đã handle để cập nhật vào data
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;
  req.body.slug = slugify(req.body.title);
  const newProducts = await Product.create(req.body);
  return res.status(200).json({
    success: newProducts ? true : false,
    products: newProducts ? newProducts : "Something went wrong",
  });
});
//get 1 sp
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const productId = await Product.findById(pid).populate({
    path: "ratings",
    populate: {
      path: "postedBy",
      select: "firstName lastName avatar",
    },
  });
  return res.status(200).json({
    success: productId ? true : false,
    productId: productId ? productId : "Cannot get product",
  });
});
//get hết sp
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  console.log("que", queries);
  //tách các trường đặc biệt ra khỏi query
  const exculdeFields = ["limit", "sort", "page", "field"];
  //xóa các trường đặc biệt trong exculdeFields
  //nó chỉ xóa các trường trong queries chứ nó không xóa hết trong req.query
  exculdeFields.forEach((item) => delete queries[item]);
  // console.log("querie", queries);
  //Format lại các operator cho đúng cú pháp mongoose là kiểu json
  //chuyển nó về kiểu json là vì khi mình thực hiện với các phương thức như : regex, gte,... trước khi thực hiện thì mình phải chuyển nó về jSON.
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  //ta sẽ thêm tiền tô $ vào trước các chữ ss như "gte,gt,lte,lt" =>$gte
  const formatedQueries = JSON.parse(queryString);
  //* Ta cũng không cần chuyển đổi thành JSON rồi qua String ta chỉ cần tạo một object rỗng để lưu giá trị
  // const formatedQueries = {};
  //Khi thực hiện xong thì mình phải truyền kiểu JSON đó về lại kiểu String để mình có thể truy vấn các trường bên trong nó
  //*Filtering
  if (queries?.title)
    //title là tên mình cần tìm
    //Vì ta đã chuyển nó về kiểu String nên ta có thể truy vấn đc
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  // if (queries.price) {
  //   formatedQueries.price = {
  //     $gt: 9000,
  //   };
  // }
  //query.title là giá trị value của key title
  // const formatedQueries = {
  //   title: { $regex: req.query.title, $options: "i" }
  // };
  //ta dùng phương thức regex để tìm kiếm các giá trị trong title có khớp với queries.title hay không
  //sau đó tìm kiếm trong Product
  //nếu hk có tham số truyền vào thì nó sẽ gét tất cả

  //get theo category không phân biệt chữ hoa chữ thường
  if (queries?.category) {
    formatedQueries.category = { $regex: queries.category, $options: "i" };
  }
  if (queries?.brand) {
    formatedQueries.brand = { $regex: queries.brand, $options: "i" };
  }
  // tìm kiếm theo nhiều color
  let colorQueryObject = {};
  if (queries?.color) {
    //B0 ta phải xóa color đã tìm trước đó
    delete formatedQueries.color;
    //B1 tách các giá tị cần tìm ra và nối nó lại thành mảng
    //{color:"red,pink"} là query người dùng nhập vào
    const colorArr = queries.color?.split(",");
    // => [red,pink]
    //B2 map các giá trị đó ra và gấn và key
    //trả về cho colorQuery là mảng chứa các object
    //[ { color: { '$regex': 'black', '$options': 'i' } } ]
    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "i" },
    }));
    //dùng phương thức or trong mongoDb để tìm kiếm vì tìm thằng này không có thì tìm thằng khác
    colorQueryObject = { $or: colorQuery };
  }

  //tìm kiếm theo nhìu trường
  let searchProducts = {};
  if (queries?.q) {
    delete formatedQueries.q;
    const orConditions = [
      { title: { $regex: queries.q, $options: "i" } },
      { brand: { $regex: queries.q, $options: "i" } },
      { category: { $regex: queries.q, $options: "i" } },
      { color: { $regex: queries.q, $options: "i" } },
    ];
    searchProducts = { $or: orConditions };
  }
  const generalQuery = {
    ...formatedQueries,
    ...colorQueryObject,
    ...searchProducts,
  };
  console.log("query", generalQuery);
  let queryCommand = Product.find(generalQuery);

  //*Sorting
  // => acd,vds => [acd,vds] => acd,vds
  if (req.query.sort) {
    //lấy trực tiếp vì mình đã xóa các giá trị đặc biệt từ query ở trên
    //nó sẽ lấy query cảu client là sort
    const sortBy = req.query.sort.split(",").join(" ");
    //dùng dấu , để tạo thành mảng sau đó dùng join để tạo thành 1 string thì phương thức sort() mới xắp sếp được
    //req.query.sort ở đây sort là key mình phải nhập vàp
    //ở đây sortBy là value các giá trị cần sắp xếp như price,name
    queryCommand = queryCommand.sort(sortBy);
    //nó sẽ dựa theo databse Product được truyền vào cho queryCommand và sắp xếp theo các trường trong queryCommand
  }
  //* Field Limiting là lấy các trường mình cần lấy
  if (req.query.field) {
    const field = req.query.field.split(",").join(" ");
    //lấy giá trị value của key đó
    queryCommand = queryCommand.select(field);
  }
  //* pagination
  //limit là số object được gọi khi mỗi lần gọi api.
  const page = +req.query.page || 1;
  //nếu client không nhập giá trị page thì nó sẽ lấy mặc định là 1
  const limit = +req.query.limit || +process.env.LIMIT_PRODUCTS;
  //giói hạn phần từ trả về mỗi trang, nếu client koh nhập thì nó sẽ lấy là 2
  const skip = (page - 1) * limit;
  //là số object cần bỏ qua, ở đây sau khi tính toán nó sẽ là 0 nghĩa là nó sẽ lấy object từ vị trí đầu tiên trở đi
  queryCommand.skip(skip).limit(limit);
  //truy vấn bỏ qua vị trị thứ 0 là lấy từ object đầu tiên, limit là lấy 2 phần tử đầu tiên
  try {
    const response = await queryCommand.exec();
    //đếm có bao nhiêu kq
    const counts = await Product.find(generalQuery).countDocuments();
    return res.status(200).json({
      counts,
      success: response ? true : false,
      products: response ? response : "Cannot get product",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
//update by id sp
const updateProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  const { pid } = req.params;
  //kt người dùng có up ảnh hay không
  const files = req?.files;
  if (files?.thumb) {
    req.body.thumb = req?.files?.thumb[0]?.path;
  }
  if (files?.images) {
    req.body.images = req?.files?.images?.map((el) => el.path);
  }
  if (data && data.title) {
    data.slug = slugify(data.title);
  }
  const updateProduct = await Product.findByIdAndUpdate(pid, data, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    mes: updateProduct ? "Update successful" : "Cannot update product",
  });
});
//delete
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deleteProduct ? true : false,
    mes: deleteProduct ? "Delete successful" : "Cannot delete product",
  });
});
//rating
const ratings = asyncHandler(async (req, res) => {
  //lấy id của người đánh giá sp
  const { id } = req.user;
  //lấy sao, comment, và id của sp đưuọc đánh giá từ client
  const { star, comment, pid, updateAt } = req.body;
  if (!star || !pid) throw new Error("Missing input");
  //sp cần được đánh giá
  const ratingProduct = await Product.findById(pid);
  //kt id đã đánh giá sp pid này trong sp đó chưa
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === id
  );
  // console.log("alreadyRating: " + alreadyRating);
  //nếu trả về true là người dùng đã đnahs giá thì bây h chỉ update lại đánh giá
  if (alreadyRating) {
    //update rating
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updateAt": updateAt,
        },
      },
      { new: true }
    );
    //nó dùng elemMatch dể kt xem alreadyRating có object nằm trong thằng ratings hay không và gán nó vào ratings
    //lúc này ratings là một object
    //updateOne có 2 đối số, đối số 1 là như một filter dể tìm kiếm, đối số 2 là data cần sửa đổi
    //ở dây trong phần updateOne ta dùng $set để thay đổi, ratings là mảng chứa phần đánh giá của kh, .$ là nó tượng trưng cho object mà thằng $elemMatch tìm được từ thằng alreadyRating .star là lấy star trong object đó. Nó sẽ bằng star và comment từ client trả về
  }
  //nếu là false là người dùng mới đnáh giá lần đầu thì add sao, bình luận và id của người đánh giá vào  ratings của product đó
  //Vì lúc đầu ratings là mảng rỗng, nên ta sẽ update nên ta dùng findByIdAndUpdate
  else {
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        //push vào field ratings
        $push: { ratings: { star, comment, postedBy: id, updateAt } },
      },
      { new: true }
    );
    // console.log("res", response);
  }

  //tính trung bình sao cho sản phẩm đó
  //tìm object của id đó
  const updateRating = await Product.findById(pid);
  //tìm độ dài ratings của sp đó nghĩa là mảng ratings có bao nhiêu đánh giá cho sp đó
  const countRating = updateRating.ratings.length;
  //cộng các sao trong sp đó
  const sumRating = updateRating.ratings.reduce((sum, el) => sum + el.star, 0);
  //tính trung bình sao và làm tròn số, đây là cachs làm tròn 1 chữ số thập phân (2.4)
  updateRating.totalRatings = Math.round((sumRating * 10) / countRating) / 10;
  //lưu vào DB
  updateRating.save();
  return res.status(200).json({
    status: true,
    updateRating,
  });
});

//upload ảnh lên cloundianry
const uploadImageProducts = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  console.log(req.files.map((f) => f.path));
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing input");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((f) => f.path) } },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updateImage: response ? response : "Cannot update image",
  });
});
const varientProducts = asyncHandler(async (req, res, next) => {
  const { pid } = req.params;
  const { title, price, color } = req.body;
  const thumb = req?.files?.thumb[0].path;
  const images = req?.files?.images?.map((f) => f.path);
  if (!(title && price && color)) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: {
        varients: {
          title,
          price,
          color,
          thumb,
          images,
          sku: uuidv4().toUpperCase(),
        },
      },
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Update varient successful" : "Cannot update varients",
  });
});

module.exports = {
  createProducts,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImageProducts,
  varientProducts,
};
