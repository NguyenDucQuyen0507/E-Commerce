import { useState, memo } from "react";
import numeral from "numeral";
import banner_blue from "assets/label_blue.png";
import banner from "assets/label.png";
import { renderStarNumber } from "utils/helpers";
import { AiFillEye } from "react-icons/ai";
import {
  BsFillSuitHeartFill,
  BsCartPlusFill,
  BsFillCartCheckFill,
} from "react-icons/bs";
import { SelectOptions } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import { showModal } from "store/categories/appSlice";
import { ProductsDetails } from "pages/public";
import { apiAddCartUsers } from "apis/user";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "utils/path";
import { toast } from "react-toastify";
import { getCurrent } from "store/users/asyncActions";
import { createSearchParams } from "react-router-dom";
const ProductSellers = ({
  productData,
  isNew,
  normol,
  navigate,
  dispatch,
  location,
}) => {
  const [display, setDisplay] = useState(false);
  const { current } = useSelector((state) => state.user);
  const handleClickOptions = async (e, flag) => {
    //Chống nổi bọt khi không có sự kiện j
    e.stopPropagation();
    if (flag === "CART") {
      // console.log(productData);
      if (!current) {
        Swal.fire({
          title: "Almost...?",
          text: "Please login! ",
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
        const response = await apiAddCartUsers({
          pid: productData?._id,
          color: productData?.color,
          price: productData?.price,
          title: productData?.title,
          thumbnail: productData?.thumb,
        });
        if (response.success) {
          toast.success(response.mes);
          dispatch(getCurrent());
        } else {
          toast.error(response.mes);
        }
      }
    }
    if (flag === "WISHLIST") {
      console.log("WISHLIST");
    }
    if (flag === "QUICK_VIEW") {
      console.log("pid", productData._id);
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <ProductsDetails
              isQuickView
              data={{ pid: productData?._id, category: productData?.category }}
            />
          ),
        })
      );
    }
  };
  return (
    <div className="w-full text-base px-[10px]">
      <div
        onClick={(e) =>
          navigate(
            `/${productData?.category.toLowerCase()}/${productData._id}/${
              productData.title
            }`
          )
        }
        className="w-full border p-[15px] flex flex-col items-center cursor-pointer"
        onMouseEnter={(e) => {
          //ngăn chặn sự nổi bọt
          //khi hover vào
          e.stopPropagation();
          setDisplay(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          //khi hover ra
          setDisplay(false);
        }}
      >
        <div className="relative w-full">
          {display && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 animate-slide-top">
              <span
                title="Wishlist"
                onClick={(e) => handleClickOptions(e, "WISHLIST")}
              >
                <SelectOptions icon={<BsFillSuitHeartFill />} />
              </span>
              {current?.cart?.some(
                (el) => el.product?._id === productData._id
              ) ? (
                <span
                  onClick={(e) => handleClickOptions(e, "")}
                  title="Added cart"
                >
                  <SelectOptions icon={<BsFillCartCheckFill />} />
                </span>
              ) : (
                <span
                  title="Add cart"
                  onClick={(e) => handleClickOptions(e, "CART")}
                >
                  <SelectOptions icon={<BsCartPlusFill />} />
                </span>
              )}
              <span
                title="Quick view"
                onClick={(e) => handleClickOptions(e, "QUICK_VIEW")}
              >
                <SelectOptions icon={<AiFillEye />} />
              </span>
            </div>
          )}
          <img
            className="w-[274px] h-[274px] object-cover"
            src={
              productData?.thumb ||
              "https://as2.ftcdn.net/v2/jpg/04/48/42/99/1000_F_448429978_3QPKF8gDqqeuuO8A8ZGRHZ9Ih1ExftBz.jpg"
            }
            alt=""
          />
          {!normol && (
            <img
              className={`absolute  h-[35px] object-cover ${
                isNew
                  ? "w-[100px] top-[-15px] left-[-28px]"
                  : "w-[70px] top-[-17px] left-[-24px]"
              }`}
              src={isNew ? banner_blue : banner}
              alt=""
            />
          )}
          <span className="absolute top-[-14px] left-[-10px] text-white font-medium text-[13px]">
            {isNew ? "Training" : "New"}
          </span>
        </div>
        <div className="flex flex-col gap-1 mt-[15px] w-full items-start">
          <p className="flex text-yellow-400 h-4">
            {renderStarNumber(productData?.totalRatings)?.map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </p>
          <p className="line-clamp-1">{productData.title}</p>
          <p>{numeral(productData.price).format("0,0$")}</p>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(ProductSellers));
