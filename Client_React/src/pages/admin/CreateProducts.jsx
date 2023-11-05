import React, { useCallback, useState, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  InputForm,
  SelectForm,
  ButtonClick,
  MarkdownEditor,
  Loading,
} from "components";
import { apiCreateProduct } from "apis/product";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { showModal } from "store/categories/appSlice";

const CreateProducts = () => {
  const { categories } = useSelector((state) => state.app);
  const [invalidateField, setInvalidateField] = useState([]);
  const [payload, setPayload] = useState({
    description: "",
  });
  const dispatch = useDispatch();
  //Lưu giữ giá trị để hover
  const [hoverImg, setHoverImg] = useState(null);
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm();
  //khi ta click vào select của category thì nó sẽ dùng watch trong useform để lấy id của thằng title đó
  // console.log(watch("category"));
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );
  //useState dùng để hiển thị ảnh
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  //Làm theo hướng dẫn
  //Hiển thị 1 ảnh
  //Tạo handlePreview nhận đối số và sau đó gọi phương thức getBase64 từ helpers.jsx để chuyển đổi, sau đó cập nhật lại thumb
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
    console.log(watch("thumb"));
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  //Hiển thị nhiều ảnh
  const handlePreviewImages = async (files) => {
    console.log("files", files);
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported !");
        return;
      } else {
        const base64 = await getBase64(file);
        imagesPreview.push({ name: file.name, path: base64 });
      }
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };
  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);
  console.log(preview);

  const handleRemoveImages = (name) => {
    if (preview.images.some((el) => el.name === name)) {
      setPreview((prev) => ({
        ...prev,
        //set lại ảnh giá trị khác với giá trị vừa click là chỉ hiển thị các ảnh khác với ảnh vừa chọn.
        images: prev.images?.filter((el) => el.name !== name),
      }));
    }
  };
  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidateField);
    if (invalids === 0) {
      if (data?.category) {
        //gán category về lại dạng title chứ không lưu dưới dạng id
        data.category = categories.find((el) => el._id === data.category).title;
      }
      //log ra description và các field còn lại
      const finalPayload = { ...data, ...payload };
      console.log(finalPayload);
      const formData = new FormData();
      //* Mục đích của đoạn này tạo ra một mảng chứa nhìu object trong object có key và value của thằng finalPayload.
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      //*Dùng để xem giá trị mà nó đã tạo key và value.
      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + "," + pair[1]);
      // }
      if (finalPayload.thumb) {
        //vì tromg thumb nó chứa length nên nó là mảng
        formData.append("thumb", finalPayload.thumb[0]);
      }
      if (finalPayload.images) {
        //* Duyệt qua mảng của images để lấy từng phẩn tử.
        for (let image of finalPayload.images) {
          formData.append("images", image);
        }
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateProduct(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        Swal.fire("Congratulations", "Create new product completed", "success");
        reset();
        setPreview({
          thumb: "",
          images: [],
        });
      } else {
        Swal.fire("!Opp", "Create new product failed", "error");
      }
    }
  };
  return (
    <div className="w-full px-4">
      <h1 className="h-[50px] font-semibold text-[25px] flex items-center opacity-[0.7]">
        Create New Products
      </h1>
      <div className="my-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label="Name product"
            id="title"
            register={register}
            errors={errors}
            validate={{ required: "Need fill this field!" }}
            fullWidth
            placeholder={"Name of new product"}
          />
          <div className="flex gap-4 my-4">
            <InputForm
              label="Price"
              id="price"
              type="number"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
              style="w-full"
              placeholder={"Price of new product"}
            />
            <InputForm
              label="Quantity"
              id="quantity"
              type="number"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
              style="w-full"
              placeholder={"Quantity of new product"}
            />
            <InputForm
              label="Color"
              id="color"
              register={register}
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              fullWidth
              style="w-full"
              placeholder={"Color of new product"}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <SelectForm
              label="Category"
              register={register}
              id="category"
              errors={errors}
              validate={{ required: "Need fill this field!" }}
              style="w-full"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
            />
            <SelectForm
              label="Brand (Optional)"
              register={register}
              id="brand"
              errors={errors}
              style="w-full"
              options={categories
                ?.find((el) => el._id === watch("category"))
                ?.brand?.map((el) => ({ code: el, value: el }))}
            />
          </div>
          <MarkdownEditor
            name="description"
            value=""
            changValue={changeValue}
            invalidateField={invalidateField}
            setInvalidateField={setInvalidateField}
          />
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
                className="w-[300px] object-contain"
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
                <div
                  key={index}
                  onMouseEnter={() => setHoverImg(el.name)}
                  className="relative w-fit"
                  onMouseLeave={() => setHoverImg(null)}
                >
                  <img
                    src={el.path}
                    alt=""
                    className="w-[300px] object-contain"
                  />
                  {hoverImg === el.name && (
                    <div
                      onClick={() => handleRemoveImages(el.name)}
                      className="absolute bg-overlay cursor-pointer inset-0 flex items-center justify-center"
                    >
                      <FaTrash size={"25px"} color="red" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <ButtonClick type="submit">Create new product</ButtonClick>
        </form>
      </div>
    </div>
  );
};

export default memo(CreateProducts);
