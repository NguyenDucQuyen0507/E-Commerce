import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonClick, InputForm } from "components";
import { useDispatch, useSelector } from "react-redux";
import avatar from "assets/usercoment.png";
import moment from "moment";
import { apiUpdateCurrent } from "apis/user";
import { getCurrent } from "store/users/asyncActions";
import { toast } from "react-toastify";
import { getBase64 } from "utils/helpers";
import { useSearchParams } from "react-router-dom";
import withBaseComponent from "hocs/withBaseComponent";
const Persional = ({ navigate }) => {
  const { current } = useSelector((state) => state.user);
  const [params] = useSearchParams();
  const [preview, setPreview] = React.useState({
    thumb: null,
  });
  console.log(params.get("redirect"));
  const dispatch = useDispatch();
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();
  useEffect(() => {
    reset({
      firstName: current?.firstName,
      lastName: current?.lastName,
      mobile: current?.mobile,
      email: current?.email,
      address: current?.address,
    });
  }, [current]);
  const handleUpdateUSer = async (data) => {
    const formData = new FormData();
    //Nếu có ảnh thì ta gán ảnh đó vào key avatar(phải trùng tên key bên router lúc .single("avatar"))
    if (data.avatar.length > 0) formData.append("avatar", data.avatar[0]);
    //Vì khi nó lưu nó là một mảng nên ta sẽ truy xuất để lấy giá trị ảnh
    //trường hợp nếu ta không chọn ảnh thì ta sẽ xóa trường avatar đi để tránh trường hợp thêm vào formData một avatar rỗng.
    //Trường hợp mà ta không xóa trường avatar đi thì lúc ta koh up ảnh nó sẽ có một field trong formData là không cần thiết
    delete data.avatar;
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);
    // ["moblie", "09876"];
    //i[0],i[1] là nó tạo key và value, value là giá trị mà người dùng nhập và<o className=""></o>
    //LÚc này thì formData có giá trị key và value nhưng mà lúc đưa lên server thì nó sẽ truy xuất giá trị value.
    //console.log([...formData]);
    //truyền dữ liệu muốn cập nhật xuống server
    const response = await apiUpdateCurrent(formData);
    if (response.success) {
      //nếu thành công thì kích hoạt getCurrent của user để nó gọi lại user và cập nhật vào current để nó thay đổi dữ liệu đã sửa
      dispatch(getCurrent());
      toast.success(response.mess);
      //chuyển hướng đến trang mycart khi update address thành công.
      if (params.get("redirect")) {
        navigate(params.get("redirect"));
      }
    } else {
      toast.error(response.mess);
    }
  };
  const handlePreviewThumb = async (file) => {
    if (!file) return "";
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      toast.warning("File not supported !");
      return;
    } else {
      const base64 = await getBase64(file);
      setPreview((prev) => ({ ...prev, thumb: base64 }));
    }
  };
  //gọi useEffect để cập nhật ảnh vào useState và dùng useState render ảnh ra cho clinet tháy trước khi update
  useEffect(() => {
    if (watch("avatar") instanceof FileList && watch("avatar").length > 0) {
      handlePreviewThumb(watch("avatar")[0]);
    }
  }, [watch("avatar")]);
  // console.log("pre", preview.thumb);
  return (
    <div className="w-full p-4">
      <div className="text-[25px] border-b-2 border-b-blue-400 font-semibold">
        Personal
      </div>
      <form
        onSubmit={handleSubmit(handleUpdateUSer)}
        className="w-3/5 mx-auto py-10 flex flex-col gap-8"
      >
        <div className="flex w-full gap-8">
          <div className="flex flex-col gap-2 w-[60%]">
            <InputForm
              label="First Name"
              id="firstName"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
            />
            <InputForm
              label="Last Name"
              id="lastName"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
            />
            <InputForm
              label="Email"
              id="email"
              register={register}
              errors={errors}
              validate={{
                required: "Require fill",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
              }}
              fullWidth
            />
            <InputForm
              label="Mobile"
              id="mobile"
              register={register}
              errors={errors}
              validate={{
                required: "Need fill this field!",
                pattern: {
                  value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                  message: "invalid phone",
                },
              }}
              fullWidth
            />
            <InputForm
              label="Address"
              id="address"
              register={register}
              errors={errors}
              validate={{
                required: "Need fill this field!",
              }}
              fullWidth
            />
            <div className="flex items-center">
              <span className="font-medium">Status: </span>
              <span className="ml-2 text-red-500 uppercase">
                {current?.isBlocked ? "Blocked" : "Actived"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Role: </span>
              <span className="ml-2 text-red-500 uppercase">
                {current?.role === 1 ? "Admin" : "User"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">CreateAt: </span>
              <span className="ml-2 text-red-500 ">
                {moment(current?.createdAt).format("DD/MM/YYYY , h:mm:ss")}
              </span>
            </div>
          </div>
          <div className="w-[40%] flex flex-col gap-2">
            <span className="font-medium">Profile image</span>
            <label htmlFor="file" className="flex ">
              {preview?.thumb && (
                <img
                  src={preview?.thumb}
                  alt="User"
                  className="w-[150px] h-[150px] object-cover cursor-pointer "
                />
              )}
              {!preview?.thumb && (
                <img
                  src={current?.avatar || avatar}
                  alt="User"
                  className="w-[150px] h-[150px] object-cover cursor-pointer "
                />
              )}
              {/* <img
                src={current?.avatar || avatar}
                alt="User"
                className="w-[150px] h-[150px] object-cover cursor-pointer "
              /> */}
            </label>
            <input type="file" id="file" {...register("avatar")} hidden />
          </div>
        </div>
        {isDirty ? (
          <div className="flex justify-end">
            <ButtonClick type="submit">Update user</ButtonClick>
          </div>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default withBaseComponent(Persional);
