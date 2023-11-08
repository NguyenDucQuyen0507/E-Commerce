import { apiGetUserOrder } from "apis/product";
import { InputField, Pagination } from "components";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import numeral from "numeral";
const History = () => {
  const [params] = useSearchParams();
  console.log(params.get("page"));
  const [orders, setOrders] = useState(null);
  const [count, setCount] = useState(0);
  const fetchOrder = async (params) => {
    const response = await apiGetUserOrder({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    console.log(response);
    if (response.success) {
      setOrders(response.orders);
      setCount(response.counts);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);
  // console.log(products);
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
          <InputField
            nameKey="q"
            // value={queries.q}
            // setValue={setQueries}
            placeholder={"Search product name ..."}
            style={"w-[500px]"}
            isHideLabel={true}
          />
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
                <td className="py-1 px-2 text-sm">
                  {el?.products?.map((or, index) => (
                    <span key={index} className="flex flex-col">
                      {or.title} - {or.color}
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
                {/* <td className="py-1 px-2">{el.price}</td>
                  <td className="py-1 px-2 text-center">{el.quantity}</td>
                  <td className="py-1 px-2 text-center">{el.sold}</td>
                  <td className="py-1 px-2 text-sm">{el.color}</td>
                  <td className="py-1 px-2 text-sm text-center">
                    {el?.varients?.length || 0}
                  </td>
                  <td className="py-1 px-2 text-center">{el.totalRatings}</td>
                  <td className="py-1 px-2">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-1 px-2 text-center ">
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
                  </td> */}
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

export default History;
