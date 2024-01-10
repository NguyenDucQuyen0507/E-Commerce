import { apiGetUserOrder } from "apis/product";
import { CustomSelectOrderHistory, Pagination } from "components";
import React, { useState, useEffect } from "react";
import { createSearchParams, useSearchParams } from "react-router-dom";
import moment from "moment";
import numeral from "numeral";
import { optionsChoose } from "utils/contants";
import { useForm } from "react-hook-form";
import withBaseComponent from "hocs/withBaseComponent";
const History = ({ navigate, location }) => {
  const [params] = useSearchParams();
  console.log([...params]);
  console.log(Object.fromEntries([...params]));
  const [orders, setOrders] = useState(null);
  const [count, setCount] = useState(0);
  const [queries, setQueries] = useState({
    q: "",
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const fetchOrder = async (params) => {
    const response = await apiGetUserOrder({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
      sort: "-createdAt",
    });
    if (response.success) {
      setOrders(response.orders);
      setCount(response.counts);
    }
  };
  const handleChangeStatus = (value) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value.value }).toString(),
    });
  };
  // const queriesDebouce = useDebouce(queries.q, 800);
  // useEffect(() => {
  //   if (queriesDebouce) {
  //     navigate({
  //       pathname: location.pathname,
  //       //tạo key trên url bằng với tên mà mình tìm kiếm
  //       search: createSearchParams({ q: queriesDebouce }).toString(),
  //     });
  //   } else {
  //     navigate({
  //       pathname: location.pathname,
  //     });
  //   }
  // }, [queriesDebouce]);
  useEffect(() => {
    const qr = Object.fromEntries([...params]);
    fetchOrder(qr);
  }, [params]);
  const status = watch("status");
  console.log(status);
  const handleNavigateProduct = (data) => {
    navigate(`/products`);
  };
  return (
    <div className="w-full p-8 min-h-screen">
      <div className="bg-gray-100 flex justify-center items-center h-[50px]">
        <div className="w-main flex flex-col gap-2">
          <h3 className="text-[25px] text-[#151515] border-b-2 border-b-blue-400 font-semibold">
            History
          </h3>
        </div>
      </div>
      <div className="w-full pr-4">
        <div className="flex justify-end py-4">
          <form className="w-[45%] grid grid-cols-2 gap-2">
            <div className="col-span-1">
              {/* <InputField
                nameKey="q"
                value={queries.q}
                setValue={setQueries}
                placeholder={"Search order ..."}
                isHideLabel={true}
              /> */}
            </div>
            <div className="col-span-1 flex items-center">
              <CustomSelectOrderHistory
                placeholder={"Status ..."}
                options={optionsChoose}
                value={status}
                onChange={(val) => handleChangeStatus(val)}
                fw={"w-full"}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-full">
        {/* <form onSubmit={handleSubmit(handleSearchProduct)}> */}
        <table className="table-auto w-full border">
          <thead className="text-left bg-blue-300 font-normal w-full">
            <tr className="border-2 w-full">
              <th className="px-2 py-2 text-sm">#</th>
              <th className="px-2 py-2 text-sm">Product</th>
              <th className="px-2 py-2 text-sm">Total</th>
              <th className="px-2 py-2 text-sm">Status</th>
              <th className="px-2 py-2 text-sm">Created At</th>
              <th className="px-2 py-2 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((el, index) => (
              <tr key={index} className="border-2">
                <td className="py-1 px-2">
                  {params.get("page")
                    ? (params.get("page") - 1) * process.env.REACT_APP_LIMIT +
                      index +
                      1
                    : index + 1}
                </td>
                <td className="py-2 px-2 text-sm flex flex-col gap-3">
                  {el?.products?.map((or, index) => (
                    <span key={index} className="flex flex-col">
                      <div className="flex gap-3 items-center">
                        <img
                          src={or?.thumbnail}
                          alt=""
                          className="w-10 h-10 object-contain"
                        />
                        <div className="flex flex-col ">
                          <span className="text-main">{or?.title}</span>
                          <span>Quantity: {or?.quantity}</span>
                        </div>
                      </div>
                    </span>
                  ))}
                </td>
                <td className="py-1 px-2">
                  {numeral(el?.total * +23500).format("0,0$")}
                </td>
                <td className="py-1 px-2 text-sm uppercase">{el?.status}</td>
                <td className="py-1 px-2 text-sm">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td
                  onClick={() => handleNavigateProduct(el)}
                  className="py-1 px-2"
                >
                  <span className="text-blue-500 hover:underline cursor-pointer italic ">
                    Products
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* </form> */}
      </div>
      <div className="w-full flex justify-end my-10">
        <Pagination totalCount={count} />
      </div>
    </div>
  );
};

export default withBaseComponent(History);
