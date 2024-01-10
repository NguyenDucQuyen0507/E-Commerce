import React, { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineDeploymentUnit,
} from "react-icons/ai";
import { InputField, Pagination } from "components";
import { UpdateProducts, VarientProducts } from "pages/admin";
import { useForm } from "react-hook-form";
import { apiGetProduct, apiDeleteProduct } from "apis/product";
import moment from "moment";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebouce from "hooks/useDebouce";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import numeral from "numeral";
const ManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [queries, setQueries] = useState({
    q: "",
  });
  const [products, setProducts] = useState(null);
  const [count, setCount] = useState(0);
  const [editProducts, setEditProducts] = useState(null);
  const [varientsProducts, setVarientsProducts] = useState(null);
  const [render, setRender] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const fetchProduct = async (params) => {
    const response = await apiGetProduct({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setProducts(response.products);
      setCount(response.counts);
    }
  };
  const queriesDebouce = useDebouce(queries.q, 800);
  useEffect(() => {
    if (queriesDebouce) {
      navigate({
        pathname: location.pathname,
        //tạo key trên url bằng với tên mà mình tìm kiếm
        search: createSearchParams({ q: queriesDebouce }).toString(),
      });
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  }, [queriesDebouce]);
  // => Luồng chạy sẽ là khi ta truyền lên url gia trị tìm kiếm mà ta đang ở page 4, khi đó params thay đổi thì useeffect gọi apis product sẽ được gọi lại và nó sẽ trở về lại page1 để hiển thị sp vừa tìm kiếm (để tránh trường hợp ta đang pag4 mà sp chỉ đủ cho pag2 làm cho sp không hiển thị được.)
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    console.log(queries);
    fetchProduct(queries);
  }, [params, render]);
  const handleSearchProduct = (data) => {
    console.log(data);
  };
  const re_render = () => {
    setRender(!render);
  };
  const handleDelete = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteProduct(pid);
        if (response.success) {
          re_render();
          toast.success(response.mes);
        } else {
          toast.error(response.mes);
        }
      }
    });
  };
  return (
    <div className="w-ful flex flex-col gap-4 relative">
      {editProducts && (
        <UpdateProducts
          editProducts={editProducts}
          setEditProducts={setEditProducts}
          re_render={re_render}
        />
      )}
      {varientsProducts && (
        <VarientProducts
          varientProducts={varientsProducts}
          re_render={re_render}
          setVarientsProducts={setVarientsProducts}
        />
      )}
      <div className="h-[70px] w-full"></div>
      <div className="w-full fixed top-0 bg-gray-100 px-4">
        <h1 className="h-[50px] font-semibold text-[25px] flex items-center opacity-[0.7]">
          Manage Products
        </h1>
      </div>
      <div className="w-full pr-4">
        <div className="flex justify-end py-4">
          <InputField
            nameKey="q"
            value={queries.q}
            setValue={setQueries}
            placeholder={"Search name ..."}
            style={"w-[500px]"}
            isHideLabel={true}
          />
        </div>
      </div>
      <div className="px-4">
        <form onSubmit={handleSubmit(handleSearchProduct)}>
          <table className="table-auto w-full border">
            <thead className="text-left bg-blue-300 font-normal w-full">
              <tr className="border-2 w-full">
                <th className="px-2 py-2 text-sm">#</th>
                <th className="px-2 py-2 text-sm">Title</th>
                <th className="px-2 py-2 text-sm">Thumb</th>
                <th className="px-2 py-2 text-sm">Brand</th>
                <th className="px-2 py-2 text-sm">Categories</th>
                <th className="px-2 py-2 text-sm">Price</th>
                <th className="px-2 py-2 text-sm">Quantity</th>
                <th className="px-2 py-2 text-sm">Sold</th>
                <th className="px-2 py-2 text-sm">Color</th>
                <th className="px-2 py-2 text-sm ">Varients</th>
                <th className="px-2 py-2 text-sm">Ratings</th>
                <th className="px-2 py-2 text-sm">CreatedAt</th>
                <th className="px-2 py-2 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((el, index) => (
                <tr key={index} className="border-2">
                  <td className="py-1 px-2">
                    {params.get("page")
                      ? (params.get("page") - 1) * process.env.REACT_APP_LIMIT +
                        index +
                        1
                      : index + 1}
                  </td>
                  <td className="py-3 px-2 text-sm">{el.title}</td>
                  <td className="py-3 px-2">
                    <img src={el.thumb} alt="thumbnail" width={"70px"} />
                  </td>
                  <td className="py-3 px-2 text-sm uppercase">{el.brand}</td>
                  <td className="py-3 px-2 text-sm">{el.category}</td>
                  <td className="py-3 px-2">
                    {numeral(el.price).format("0,0$")}
                  </td>
                  <td className="py-3 px-2 text-center">{el.quantity}</td>
                  <td className="py-3 px-2 text-center">{el.sold}</td>
                  <td className="py-3 px-2 text-sm">{el.color}</td>
                  <td className="py-3 px-2 text-sm text-center">
                    {el?.varients?.length || 0}
                  </td>
                  <td className="py-3 px-2 text-center">{el.totalRatings}</td>
                  <td className="py-3 px-2">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-3 px-2 text-center ">
                    <span className="flex gap-2">
                      <span
                        onClick={() => setEditProducts(el)}
                        className="text-blue-500 hover:underline cursor-pointer italic hover:text-orange-400"
                      >
                        <AiOutlineEdit size={"20"} />
                      </span>
                      <span
                        onClick={() => handleDelete(el._id)}
                        className="text-blue-500 hover:underline cursor-pointer italic hover:text-orange-400"
                      >
                        <AiOutlineDelete size={"20"} />
                      </span>
                      <span
                        onClick={() => setVarientsProducts(el)}
                        className="text-blue-500 hover:underline cursor-pointer italic hover:text-orange-400"
                      >
                        <AiOutlineDeploymentUnit size={"20"} />
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-end my-10">
          <Pagination totalCount={count} />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
