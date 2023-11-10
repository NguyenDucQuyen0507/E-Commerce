import React, { useEffect, useState, useCallback } from "react";
import {
  createSearchParams,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  BreadCrumbs,
  ProductSellers,
  FilterSearch,
  SelectSortby,
  Pagination,
} from "../../components";
import { sortBy } from "../../utils/contants";
import { apiGetProduct } from "../../apis/product";
import Masonry from "react-masonry-css";
const Products = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  console.log(category);
  //lấy các giá trị param
  const [params] = useSearchParams();
  console.log([...params]);
  const [product, setProduct] = useState(null);
  const [sort, setSort] = useState("");
  const fetchProductCategory = async (queries) => {
    if (category && category !== "products") queries.category = category;
    //trường hợp sai của !=="products" là === "products"
    const response = await apiGetProduct(queries);
    setProduct(response);
  };
  const [active, setActive] = useState(null);
  const handleActive = useCallback(
    (name) => {
      // setActive(name);
      //lúc clcik lần đầu thì nó sẽ mang theo tên mà ban đầu active là null nên nó sẽ nhảy vào else và set lại nó về tên đó
      if (active === name) {
        setActive(null);
      } else {
        setActive(name);
      }
    },
    [active]
  );
  useEffect(() => {
    //Dùng để xem giá trị đã lấy được ở params
    let param = [];
    for (let i of params.entries()) param.push(i);
    // console.log("param", param);
    //bây h ta sửa lại tìm kiếm nhìu giá trị thì bên FilterSearch ta đã chuyển các giá trị trong mảng thành một string bằng join(",") và bên này nó sẽ nhận là  ['color', 'red,pink']
    //tương tự với price
    const queries = {};
    for (let i of params) {
      queries[i[0]] = i[1];
    }
    //* Xử lý query theo from và to
    let queryPrice = {};
    // console.log(queries);
    if (queries.to && queries.from) {
      queryPrice = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      //ta cũng xóa price nếu ta đã tìm xong
      delete queries.price;
    }
    //*Xử lý query theo từng cái
    //khi mình nhập from thì nó sẽ hiển thị trên url
    //queries sẽ xử lý và mình sẽ lấy trường from chứa giá tiền
    //tạo key price = với phương thức lơn hơn hoặc bằng với giá tiền vừa nhập vào.
    //xóa giá trị from vì nếu hk xóa thì nó sẽ dính vào gte là nó sẽ như này
    //{ from: '100000', price: { gte: '100000' } } thì query sẽ không được
    //{ price: { gte: '1000000' } } ok
    if (queries.from) {
      queries.price = { gte: queries.from };
      delete queries.from;
    }

    //query đến nhỏ hơn hoặc bằng
    if (queries.to) {
      queries.price = { lte: queries.to };
      delete queries.to;
    }
    //Vì khi gán nó vào một đối tượng object thì nó sẽ tự động gán nó về dạng đối tượng javascript nên nó sẽ là {color:"red,pink"}
    //price {from:"21 "}
    const q = { ...queryPrice, ...queries };
    // console.log(q);
    fetchProductCategory(q);
    window.scrollTo(0, 0);
  }, [category, params]);

  const changValue = useCallback(
    (value) => {
      setSort(value);
    },
    [sort]
  );
  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ sort: sort }).toString(),
        //{"sort":"-sold"}
        //{sort:"-sold"}
      });
    }
  }, [sort]);
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  return (
    <div className="w-ful mt-5">
      <div className="bg-gray-100 flex justify-center items-center h-[80px]">
        <div className="w-main flex flex-col gap-2">
          <h3 className="text-[20px] text-[#151515] font-medium uppercase">
            {category}
          </h3>
          <BreadCrumbs category={category} />
        </div>
      </div>
      <div className="w-main m-auto">
        <div className="flex justify-between mt-5 p-4 border">
          <div className="w-4/5 flex flex-col gap-3">
            <span className="text-[18px] font-medium">Filter by</span>
            <div className="flex gap-2">
              <FilterSearch
                name="price"
                type="input"
                active={active}
                handleActive={handleActive}
              />
              <FilterSearch
                name="color"
                active={active}
                handleActive={handleActive}
              />
            </div>
          </div>
          <div className="w-1/5">
            <div className="flex flex-col gap-3">
              <span className="text-[18px] font-medium">Sort by</span>
              <span>
                <SelectSortby
                  changValue={changValue}
                  value={sort}
                  options={sortBy}
                />
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 w-main">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid flex flex-wrap mx-[-10px]"
            columnClassName="my-masonry-grid_column"
          >
            {product?.products?.map((el) => (
              <ProductSellers key={el._id} productData={el} normol={true} />
            ))}
          </Masonry>
        </div>
      </div>

      <div className="w-main m-auto flex justify-end ">
        <Pagination totalCount={product?.counts} />
      </div>

      <div className="h-[500px] w-main m-auto mt-10"></div>
    </div>
  );
};

export default Products;
