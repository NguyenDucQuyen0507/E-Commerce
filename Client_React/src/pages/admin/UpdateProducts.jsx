import React, { memo, useState, useEffect, useCallback } from "react";
import {
  InputForm,
  SelectForm,
  MarkdownEditor,
  ButtonClick,
  Loading,
} from "components";
import { FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { getBase64, validate } from "utils/helpers";
import { toast } from "react-toastify";
import { apiUpdateProduct } from "apis/product";
import { showModal } from "store/categories/appSlice";
import Swal from "sweetalert2";
import { RiArrowGoBackFill } from "react-icons/ri";
const UpdateProducts = ({ editProducts, setEditProducts, re_render }) => {
  const { categories } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  //Lưu giữ giá trị để hover
  const [hoverImg, setHoverImg] = useState(null);
  //useState dùng để hiển thị ảnh
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [payload, setPayload] = useState({
    description: "",
  });
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const [invalidateField, setInvalidateField] = useState([]);
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    reset({
      title: editProducts?.title || "",
      price: editProducts?.price || "",
      quantity: editProducts?.quantity || "",
      color: editProducts?.color || "",
      category: editProducts?.category || "",
      brand: editProducts?.brand?.toLowerCase() || "",
    });
    setPayload({
      //Vì trong lúc lưu description là mảng nên nó sẽ không hiển thị ra. Nên ta sẽ kiểm tra nó có phải là object hay không? Nếu đúng thì nối nó lại thành chuỗi string, nếu không là mảng thì in nó ra
      description:
        typeof editProducts?.description === "object"
          ? editProducts?.description?.join(", ")
          : editProducts?.description,
    });
    setPreview({
      thumb: editProducts?.thumb || "",
      images: editProducts?.images || [],
    });
  }, [editProducts]);
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
  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidateField);
    if (invalids === 0) {
      if (data?.category) {
        data.category = categories?.find(
          (el) => el.title === data.category
        ).title;
      }
      const finalPayload = { ...data, ...payload };
      finalPayload.thumb =
        finalPayload?.thumb?.length === 0
          ? preview.thumb
          : finalPayload.thumb[0];
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      finalPayload.images =
        finalPayload?.images?.length === 0
          ? preview.images
          : finalPayload.images;
      for (let image of finalPayload.images) {
        formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateProduct(formData, editProducts._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        setEditProducts(null);
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
  const handleRemoveImages = (name) => {
    if (preview.images.some((el) => el.name === name)) {
      setPreview((prev) => ({
        ...prev,
        //set lại ảnh giá trị khác với giá trị vừa click là chỉ hiển thị các ảnh khác với ảnh vừa chọn.
        images: prev.images?.filter((el) => el.name !== name),
      }));
    }
  };
  return (
    <div className="absolute inset-0 bg-white z-30">
      <div className="h-[70px] w-full"></div>
      <div className=" fixed top-0 bg-gray-100 px-4 flex justify-between right-0 left-[330px] items-center z-40">
        <h1 className="h-[50px] font-semibold text-[25px] flex items-center opacity-[0.7]">
          Update Products
        </h1>
        <span
          className="text-main cursor-pointer hover:underline"
          onClick={() => setEditProducts(null)}
        >
          <RiArrowGoBackFill size={"25px"} />
        </span>
      </div>
      <div className="px-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
                code: el.title,
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
                ?.find((el) => el.title === watch("category"))
                ?.brand?.map((el) => ({ code: el.toLowerCase(), value: el }))}
            />
          </div>
          <MarkdownEditor
            name="description"
            value={payload.description}
            changValue={changeValue}
            invalidateField={invalidateField}
            setInvalidateField={setInvalidateField}
          />
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-medium" htmlFor="thumb">
              Upload thumb
            </label>
            <input type="file" id="thumb" {...register("thumb")} />
            {errors["thumb"] && (
              <small className="text-sm text-red-500">
                {errors["thumb"]?.message}
              </small>
            )}
          </div>
          {preview?.thumb && (
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
              {...register("images")}
              multiple
            />
            {errors["images"] && (
              <small className="text-sm text-red-500">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preview?.images?.length > 0 && (
            <div className="mt-4 flex gap-4 flex-wrap">
              {preview?.images?.map((el, index) => (
                <div
                  key={index}
                  //   onMouseEnter={() => setHoverImg(el.name)}
                  className="relative w-fit"
                  //   onMouseLeave={() => setHoverImg(null)}
                >
                  <img src={el} alt="" className="w-[200px] object-contain" />
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
          <ButtonClick type="submit">Update product</ButtonClick>
        </form>
      </div>
      <div className="h-[50px]"></div>
    </div>
  );
};

export default memo(UpdateProducts);
