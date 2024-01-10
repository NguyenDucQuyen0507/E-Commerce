import { apiDeleteUserOrder, apiGetAllOrder } from "apis/product";
import { ButtonClick, CustomSelectOrderHistory, Pagination } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import useDebouce from "hooks/useDebouce";
import moment from "moment";
import numeral from "numeral";
import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { optionsChoose } from "utils/contants";

const ManageOrder = ({ navigate, location }) => {
  const [order, setOrder] = useState([]);
  const [count, setCount] = useState(0);
  const [render, setRender] = useState(false);
  const [params] = useSearchParams();
  console.log(params);
  const {
    watch,
    register,
    formState: { errors, isDirty },
  } = useForm();
  const fetchOrder = async (params) => {
    const response = await apiGetAllOrder({
      ...params,
      sort: "-createdAt",
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setOrder(response.orders);
      setCount(response.counts);
    }
  };
  const re_render = () => {
    // có sự thay đổi nó mới re-render lại order để cập nhật lại
    setRender(!render);
  };
  const handleOrderUser = (orId) => {
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
        const response = await apiDeleteUserOrder(orId);
        if (response.success) {
          re_render();
          toast.success(response.mes);
        } else {
          toast.error(response.mes);
        }
      }
    });
  };
  const handleChangeStatus = (value) => {
    // console.log(value);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        // redirect: location.pathname,
        status: value.value,
      }).toString(),
    });
  };
  const status = watch("status");

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (watch("startDate")) {
      queries.startDate = watch("startDate");
    } else delete queries.startDate;
    if (watch("endDate")) {
      queries.endDate = watch("endDate");
    } else delete queries.endDate;
    queries.page = 1;
    if (watch("startDate") && watch("endDate")) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams(queries).toString(),
        // search:
      });
    }
  }, [watch("startDate"), watch("endDate")]);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    fetchOrder(queries);
  }, [params]);
  return (
    <div className="w-full p-8 min-h-screen flex flex-col">
      <div className=" flex justify-center items-center h-[50px]">
        <div className="w-main flex flex-col gap-2">
          <h3 className="text-[25px] text-[#151515] border-b-2 border-b-blue-400 font-semibold">
            Manager Order
          </h3>
        </div>
      </div>
      <div className="w-full pr-4">
        <div className="flex justify-between py-4 items-center">
          <form action="">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="mr-4">Từ ngày</span>
                <input
                  className="h-[40px] border-gray"
                  type="date"
                  {...register("startDate")}
                  errors={errors}
                />
                <span className="mx-4">đến ngày</span>
                <input
                  className="h-[40px] border-gray"
                  type="date"
                  {...register("endDate")}
                  errors={errors}
                />
              </div>

              {/* <button
                className="w-[80px] h-[40px] border rounded-lg bg-blue-400 hover:bg-blue-300"
                type="submit"
              >
                Search
              </button> */}
            </div>
          </form>
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
                options={optionsChoose}
                placeholder={"Status..."}
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
              <th className="px-2 py-2 text-sm">OrderBy</th>
              <th className="px-2 py-2 text-sm">Mobile</th>
              <th className="px-2 py-2 text-sm">Created At</th>
              <th className="px-2 py-2 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((el, index) => (
              <tr key={index} className="border-2">
                <td className="py-1 px-2">
                  {params.get("page")
                    ? (params.get("page") - 1) * process.env.REACT_APP_LIMIT +
                      index +
                      1
                    : index + 1}
                </td>
                <td className="py-4 px-1 text-sm flex flex-col gap-3">
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
                <td className="py-1 px-2 text-sm uppercase">{`${el?.orderBy?.firstName} ${el?.orderBy?.lastName}`}</td>
                <td className="py-1 px-2 text-sm uppercase">
                  {el?.orderBy.mobile}
                </td>
                <td className="py-1 px-2 text-sm">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="py-1 px-2 text-center ">
                  <span
                    onClick={() => handleOrderUser(el._id)}
                    className="text-blue-500 hover:underline cursor-pointer italic hover:text-main"
                  >
                    <AiOutlineDelete size={"20"} />
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

export default withBaseComponent(memo(ManageOrder));
