import React, { useEffect, useState, useCallback, useRef } from "react";
import { createSearchParams, useParams } from "react-router-dom";
import { apiGetCurrentProduct, apiGetProduct } from "../../apis/product";
import {
  BreadCrumbs,
  ButtonClick,
  SelectQuanity,
  ProductExtra,
  ProductInformation,
  CustomSlide,
} from "../../components";
import Slider from "react-slick";
// import ReactImageMagnify from "react-image-magnify";
import numeral from "numeral";
import { renderStarNumber } from "../../utils/helpers";
import { quality } from "../../utils/contants";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "utils/path";
import { apiAddCartUsers } from "apis/user";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/users/asyncActions";
import { toast } from "react-toastify";
const ProductsDetails = ({
  isQuickView,
  data,
  navigate,
  dispatch,
  location,
}) => {
  const { current } = useSelector((state) => state.user);
  const scrollRef = useRef();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [categorySlider, setcategorySlider] = useState(null);
  //khi click vào image slider thì sẽ thay thế ảnh đại diện
  const [currentImages, setCurrentImages] = useState(null);
  //render lại khi đã gửi rating
  const [rerender, setRerender] = useState(false);
  const [varient, setVarient] = useState(null);
  //set đồng loạt tất cả sự đổi khi click vào varient
  const [currentProducts, setCurrentProducts] = useState({
    title: "",
    color: "",
    price: "",
    thumb: "",
    images: [],
  });
  const [pid, setPid] = useState(null);
  const [category, setCategory] = useState(null);
  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === "minute") {
        if (+quantity === 1) {
          return;
        }
        setQuantity((prev) => +prev - 1);
      }
      if (flag === "plus") {
        if (+quantity === +product.quantity) {
          window.alert("Quantity exceeds stock product");
          return;
        }
        setQuantity((prev) => +prev + 1);
      }
    },
    [+quantity, product]
  );
  const hanldeQuantity = useCallback(
    (number) => {
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [+quantity]
  );
  const handleAddToCart = async () => {
    if (!current) {
      Swal.fire({
        title: "Almost...?",
        text: "Please login!",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Not now!",
        confirmButtonText: "Go to login page",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
        }
      });
    } else {
      //nếu có varient thì lấy varient còn không lấy sp đó
      const response = await apiAddCartUsers({
        pid: pid,
        quantity,
        color: currentProducts?.color || product?.color,
        price: currentProducts?.price || product?.price,
        thumbnail: currentProducts?.thumb || product?.thumb,
        title: currentProducts?.title || product?.title,
      });
      if (response.success) {
        toast.success(response.mes);
        dispatch(getCurrent());
      } else {
        toast.error(response.mes);
      }
    }
  };
  //thực hiện useEffect để lấy dữ liệu set vào pid và category
  useEffect(() => {
    if (data && data.pid) {
      setPid(data?.pid);
      setCategory(data?.category);
    } else {
      if (params && params?.pid) {
        setPid(params?.pid);
        setCategory(params?.category);
      }
    }
  }, [data, params]);
  //Cập nhật lại các field khi có ta click vào varients.
  useEffect(() => {
    if (varient) {
      setCurrentProducts({
        title: product?.varients?.find((el) => el.sku === varient)?.title,
        color: product?.varients?.find((el) => el.sku === varient)?.color,
        price: product?.varients?.find((el) => el.sku === varient)?.price,
        thumb: product?.varients?.find((el) => el.sku === varient)?.thumb,
        images: product?.varients?.find((el) => el.sku === varient)?.images,
      });
    } else {
      setCurrentProducts({
        title: "",
        color: "",
        price: "",
        thumb: "",
        images: [],
      });
    }
  }, [varient]);
  const fetchProduct = async () => {
    const response = await apiGetCurrentProduct(pid);
    if (response.success) {
      setProduct(response?.productId);
      setCurrentImages(response?.productId?.thumb);
    }
  };
  const fetchProductCategory = async () => {
    const response = await apiGetProduct({ category: category });
    if (response.success) {
      setcategorySlider(response.products);
    }
  };
  const re_rednder = useCallback(() => {
    setRerender(!rerender);
  }, [rerender]);

  useEffect(() => {
    if (pid) {
      fetchProduct();
      fetchProductCategory();
    }
    setVarient(null);
    if (isQuickView) {
      window.scrollTo(0, 0);
    } else {
      scrollRef.current.scrollIntoView({ block: "center" });
    }
    //* Khi thay đổi sản phẩm thì nó sẽ gọi lại data thì thằng này sẽ giúp chạy lên đầu trang
  }, [pid, category]);
  //Gọi lại data khi re_rednder được gọi
  useEffect(() => {
    if (pid) {
      fetchProduct();
    }
  }, [rerender]);
  console.log(product);
  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentImages(el);
  };
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };
  // console.log(product);
  // console.log("varient", varient);
  // console.log("currentProducts", currentProducts.thumb);
  // console.log("currentImage", currentImages);
  return (
    <div className={`w-full `}>
      {!isQuickView && (
        <div
          ref={scrollRef}
          className="bg-gray-100 flex justify-center items-center h-[80px]"
        >
          <div className="w-main flex flex-col gap-2">
            <h3 className="text-[20px] text-[#151515] font-medium">
              {currentProducts?.title || product?.title}
            </h3>
            <BreadCrumbs
              title={currentProducts?.title || product?.title}
              category={product?.category}
            />
          </div>
        </div>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          `bg-white m-auto mt-4 flex`,
          isQuickView
            ? "max-w-[800px] gap-2 p-6 max-h-[90vh] overflow-y-auto"
            : "w-main"
        )}
      >
        <div className="flex-2 flex flex-col gap-4 w-full">
          {!isQuickView && (
            <div className="w-[458px] h-[458px] border object-cover flex items-center justify-center">
              <img src={currentProducts?.thumb} alt="" />
              {/* <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "Wristwatch by Ted Baker London",
                    isFluidWidth: true,
                    src: currentProducts?.thumb || currentImages,
                  },
                  largeImage: {
                    src: currentProducts?.thumb || currentImages,
                    width: 1800,
                    height: 1800,
                  },
                }}
              /> */}
            </div>
          )}
          {isQuickView && (
            <div className="w-[358px] h-[358px] border object-cover flex items-center justify-center">
              <img src={currentProducts?.thumb || currentImages} alt="" />
            </div>
          )}
          <div className="w-[460px]">
            <Slider className="images-slider w-full" {...settings}>
              {currentProducts?.images?.length === 0 &&
                product?.images?.map((item, index) => (
                  <div key={item} className="px-2 flex-1">
                    <img
                      //lấy hình của chính nó truyền vào
                      //Sau đó lên hàm xử lý
                      onClick={(e) => handleClickImage(e, item)}
                      src={item}
                      alt=""
                      className="w-[143px] h-[143px] object-contain border p-2 cursor-pointer"
                    />
                  </div>
                ))}
              {currentProducts?.images?.length > 0 &&
                currentProducts?.images?.map((item, index) => (
                  <div key={item} className="px-2 flex-1">
                    <img
                      //lấy hình của chính nó truyền vào
                      //Sau đó lên hàm xử lý
                      onClick={(e) => handleClickImage(e, item)}
                      src={item}
                      alt=""
                      className="w-[143px] h-[143px] object-contain border p-2 cursor-pointer"
                    />
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <div className="flex-2 flex-col gap-2 px-2">
          <div className="flex items-center justify-between">
            <p className="text-[25px] font-normal">
              {numeral(currentProducts?.price || product?.price).format("0,0$")}
            </p>
            <span className="text-main text-sm">
              Stock: {product?.quantity}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex text-yellow-400">
              {renderStarNumber(product?.totalRatings)?.map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </span>
            <p className="text-sm text-main italic">
              Sold: {product?.sold} product
            </p>
          </div>
          <ul className="list-square px-4">
            {product?.description?.length > 1 &&
              product?.description.map((el) => (
                <li className="text-sm leading-6 " key={el}>
                  {el}
                </li>
              ))}
            {product?.description?.length === 1 && (
              <li
                className="text-sm line-clamp-6"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0]),
                }}
              ></li>
            )}
          </ul>
          <div className="flex my-4 gap-2">
            <span className="font-bold text-xs">Color: </span>
            <div className="flex gap-2 w-full flex-wrap">
              <div
                onClick={() => setVarient(null)}
                className={clsx(
                  "flex items-center gap-1 border p-2 rounded-[20px] cursor-pointer",
                  !varient && "border-red-500"
                )}
              >
                <img
                  src={product?.thumb}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
                <div className="flex flex-col">
                  <span>{product?.color}</span>
                  {numeral(product?.price).format("0,0$")}
                </div>
              </div>
              {product?.varients?.map((el) => (
                <div
                  onClick={() => setVarient(el.sku)}
                  className={clsx(
                    "flex items-center gap-1 border p-2 rounded-[20px] cursor-pointer",
                    varient === el.sku && "border-red-500"
                  )}
                >
                  <img
                    src={el?.thumb}
                    alt=""
                    className="w-10 h-10 object-cover"
                  />
                  <div className="flex flex-col">
                    <span>{el?.color}</span>
                    {numeral(el?.price).format("0,0$")}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xs font-semibold">Quantity</span>
            <SelectQuanity
              value={+quantity}
              quantity={product?.quantity}
              hanldeQuantity={hanldeQuantity}
              handleChangeQuantity={handleChangeQuantity}
            />
          </div>
          <ButtonClick fw handleClick={handleAddToCart}>
            Add to cart
          </ButtonClick>
        </div>
        {!isQuickView && (
          <div className="flex-1 px-2">
            <>
              {quality?.map((el) => (
                <ProductExtra title={el.title} sub={el.sub} icon={el.icon} />
              ))}
            </>
          </div>
        )}
      </div>
      {!isQuickView && (
        <>
          <div className="w-main m-auto mt-10">
            <ProductInformation
              nameProduct={currentProducts?.title || product?.title}
              totalRatings={product?.totalRatings}
              ratings={product?.ratings}
              pid={product?._id}
              re_rednder={re_rednder}
            />
          </div>
          <div className=" w-main m-auto mt-10 ">
            <h2 className="text-[20px] font-medium border-b-2 border-main pb-2 ">
              OTHER CUSTOMERS ALSO BUY
            </h2>
            <div className="mt-5 mx-[-10px]">
              <CustomSlide
                normol={true}
                products={categorySlider}
                setCurrentProducts={setCurrentProducts}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withBaseComponent(ProductsDetails);
