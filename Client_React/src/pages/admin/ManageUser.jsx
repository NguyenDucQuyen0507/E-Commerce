import React, { useEffect, useState, memo, useCallback } from "react";
import { apiDeleteUsers, apiGetUsers, apiUpdateUsers } from "apis/user";
import {
  ButtonClick,
  InputField,
  InputForm,
  Pagination,
  SelectForm,
} from "components";
import useDebouce from "hooks/useDebouce";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { Roles, StatusUser } from "utils/contants";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import clsx from "clsx";
const ManageUser = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    role: "",
    isBlocked: "",
  });
  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });
  const [editElm, setEditElm] = useState(null);
  const [update, setUpdate] = useState(false);

  const [params] = useSearchParams();
  // console.log(params);
  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: +process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setUsers(response);
    }
  };
  const queriesDebounce = useDebouce(queries.q, 800);
  useEffect(() => {
    //taoj queries để gán key và value cho nó
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    //Lúc này q sẽ là key và value là queriesDebounce.
    // Sau truyền nó xuống server và server nhận và xủ lý
    fetchUsers(queries);
  }, [queriesDebounce, params, update]);
  // console.log(editElm);
  const renderUpdate = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  const handleUpdate = async (data) => {
    // console.log(data);
    const response = await apiUpdateUsers(data, editElm?._id);
    if (response.success) {
      Swal.fire("Congratulations", "Update successful", "success");
      //mất các ô input
      setEditElm(null);
      //cập nhật lại apis
      renderUpdate();
    } else {
      Swal.fire("!Opp", response.mess, "error");
    }
  };
  const handleDelete = (uid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUsers(uid);
        if (response.success) {
          renderUpdate();
          toast.success(response.mess);
        } else {
          toast.error(response.mess);
        }
      }
    });
  };
  return (
    <div className={clsx("w-full px-4")}>
      <h1 className="h-[50px] font-semibold text-[25px] flex items-center opacity-[0.7]">
        Manage users
      </h1>
      <div className="w-full ">
        <div className="flex justify-end py-4">
          <InputField
            nameKey="q"
            value={queries.q}
            setValue={setQueries}
            placeholder={"Search name or email users..."}
            style={"w-[500px]"}
            isHideLabel={true}
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {editElm && <ButtonClick type="submit">Update</ButtonClick>}
          <table className="table-auto mt-3 border w-full">
            <thead className="font-normal text-left bg-blue-300 w-full">
              <tr className="border-2">
                <th className="px-2 py-1 text-sm">#</th>
                <th className="px-3 py-2 text-sm">FirstName</th>
                <th className="px-3 py-2 text-sm">LastName</th>
                <th className="px-3 py-2 text-sm">Email</th>
                <th className="px-3 py-2 text-sm">Mobile</th>
                <th className="px-3 py-2 text-sm">Status</th>
                <th className="px-3 py-2 text-sm">Role</th>
                <th className="px-3 py-2 text-sm">CreateAt</th>
                <th className="px-3 py-2 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.Users?.map((el, index) => (
                <tr key={el._id} className="border-2">
                  <td className="px-2 py-1">
                    {params.get("page")
                      ? (params.get("page") - 1) * process.env.REACT_APP_LIMIT +
                        index +
                        1
                      : index + 1}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        fullWidth
                        register={register}
                        errors={errors}
                        id={"firstName"}
                        defaultValue={editElm?.firstName}
                        validate={{ required: "Require fill" }}
                      />
                    ) : (
                      <span>{el.firstName}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        fullWidth
                        register={register}
                        errors={errors}
                        id={"lastName"}
                        defaultValue={editElm?.lastName}
                        validate={{ required: "Require fill" }}
                      />
                    ) : (
                      <span>{el.lastName}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        fullWidth
                        register={register}
                        errors={errors}
                        id={"email"}
                        defaultValue={editElm?.email}
                        validate={{
                          required: "Require fill",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        fullWidth
                        register={register}
                        errors={errors}
                        id={"mobile"}
                        defaultValue={editElm?.mobile}
                        validate={{
                          required: "Need fill this field!",
                          pattern: {
                            value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                            message: "invalid phone",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <SelectForm
                        fullWidth
                        register={register}
                        errors={errors}
                        id={"isBlocked"}
                        defaultValue={editElm?.isBlocked}
                        validate={{ required: "Require fill" }}
                        options={StatusUser}
                      />
                    ) : (
                      <span>{el.isBlocked ? "Blocked" : "Actived"}</span>
                    )}
                  </td>

                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <SelectForm
                        fullWidth
                        register={register}
                        errors={errors}
                        id={"role"}
                        defaultValue={editElm?.role}
                        validate={{ required: "Require fill" }}
                        options={Roles}
                      />
                    ) : (
                      <span>
                        {Roles.find((role) => +role.code === +el.role).value}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    {editElm?._id === el._id ? (
                      <span
                        className="cursor-pointer hover:underline text-orange-400"
                        onClick={() => setEditElm(null)}
                      >
                        Back
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer hover:underline text-orange-400"
                        onClick={() => setEditElm(el)}
                      >
                        Edit
                      </span>
                    )}
                    <span
                      className="cursor-pointer hover:underline text-orange-400"
                      onClick={() => handleDelete(el._id)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-end">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default memo(ManageUser);
