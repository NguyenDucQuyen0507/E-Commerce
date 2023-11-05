import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonClick, InputForm, Loading } from "components";
import { getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { RiArrowGoBackFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { showModal } from "store/categories/appSlice";
import { apiVarientProduct } from "apis/product";
import { useDispatch } from "react-redux";
const VarientProducts = ({
  setVarientsProducts,
  varientProducts,
  re_render,
}) => {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    reset({
      title: varientProducts?.title || "",
      price: varientProducts?.price || "",
      color: varientProducts?.color || "",
    });
  }, [varientProducts]);

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
  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
      handlePreviewThumb(watch("thumb")[0]);
    }
  }, [watch("thumb")]);
  //Hiển thị nhiều ảnh
  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported !");
        return;
      } else {
        const base64 = await getBase64(file);
        imagesPreview.push(base64);
      }
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };
  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0) {
      handlePreviewImages(watch("images"));
    }
  }, [watch("images")]);

  const handleVarientSubmit = async (data) => {
    if (varientProducts.color === data.color) {
      Swal.fire("Opps!", "Color not changed", "info");
    } else {
      const formData = new FormData();
      for (let i of Object.entries(data)) formData.append(i[0], i[1]);
      //*Dùng để xem giá trị mà nó đã tạo key và value.
      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + "," + pair[1]);
      // }
      if (data?.thumb) {
        //vì tromg thumb nó chứa length nên nó là mảng
        formData.append("thumb", data?.thumb[0]);
      }
      if (data?.images) {
        //* Duyệt qua mảng của images để lấy từng phẩn tử.
        for (let image of data?.images) {
          formData.append("images", image);
        }
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiVarientProduct(formData, varientProducts._id);
      console.log(response);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        setVarientsProducts(null);
        re_render();
        Swal.fire("Congratulations", response.mes, "success");
        setPreview({
          thumb: "",
          images: [],
        });
      } else {
        Swal.fire("!Opp", response.mes, "error");
      }
    }
  };
  return (
    <div className="absolute inset-0 bg-white z-30">
      <div className="h-[70px] w-full"></div>
      <div className=" fixed top-0 bg-gray-100 px-4 flex justify-between right-0 left-[330px] items-center z-40">
        <h1 className="h-[50px] font-semibold text-[25px] flex items-center opacity-[0.7]">
          Varient Products
        </h1>
        <span
          onClick={() => setVarientsProducts(null)}
          className="text-main cursor-pointer hover:underline"
        >
          <RiArrowGoBackFill size={"25px"} />
        </span>
      </div>
      <div className="px-4 mt-8">
        <form onSubmit={handleSubmit(handleVarientSubmit)} className="w-full">
          <div className="flex gap-4 items-center">
            <InputForm
              label="Varient of title"
              id="title"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
              style={"flex-auto"}
            />
            <InputForm
              label="Varient of price"
              id="price"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
              style={"flex-auto"}
            />
            <InputForm
              label="Varient of color"
              id="color"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
              style={"flex-auto"}
            />
          </div>
          <div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-medium" htmlFor="thumb">
                Upload thumb
              </label>
              <input
                type="file"
                id="thumb"
                {...register("thumb", { required: true })}
              />
              {errors["thumb"] && (
                <small className="text-sm text-red-500">
                  {errors["thumb"]?.message}
                </small>
              )}
            </div>
            {preview.thumb && (
              <div className="mt-4">
                <img
                  src={preview.thumb}
                  alt="thumbnail"
                  className="w-[200px] object-contain"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-medium" htmlFor="productsImg">
                Upload for images product
              </label>
              <input
                type="file"
                id="productsImg"
                {...register("images", { required: true })}
                multiple
              />
              {errors["images"] && (
                <small className="text-sm text-red-500">
                  {errors["images"]?.message}
                </small>
              )}
            </div>
            {preview.images.length > 0 && (
              <div className="mt-4 flex gap-4 flex-wrap">
                {preview.images.map((el, index) => (
                  <div key={index} className="relative w-fit">
                    <img src={el} alt="" className="w-[200px] object-contain" />
                  </div>
                ))}
              </div>
            )}
            <ButtonClick type="submit">Add new varient product</ButtonClick>
          </div>
        </form>
      </div>
      <div className="h-[50px]"></div>
    </div>
  );
};

export default VarientProducts;
