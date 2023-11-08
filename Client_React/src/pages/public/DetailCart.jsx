import React from "react";
import { ButtonClick, OrderItem } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import { useSelector } from "react-redux";
import numeral from "numeral";
import { updateCart } from "store/users/userSlice";
import { createSearchParams } from "react-router-dom";
import { BsFillBagHeartFill } from "react-icons/bs";
import path from "utils/path";
import Swal from "sweetalert2";
const DetailCart = ({ location, dispatch, navigate }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const handleChangeQuantities = (pid, quantity, color) => {
    dispatch(updateCart({ pid, quantity, color }));
  };
  const handleUpdateAddress = () => {
    if (!current?.address) {
      Swal.fire({
        title: "Almost...?",
        text: "Please update address before buy product! ",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Not now!",
        confirmButtonText: "Update now",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate({
            pathname: `/${path.MEMBER}/${path.PERSONAL}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
        }
      });
    } else {
      window.open(`/${path.CHECKOUT}`, "_blank");
    }
  };
  return (
    <div className="w-full p-8 min-h-screen">
      <div className="bg-gray-100 flex justify-center items-center h-[50px]">
        <div className="w-main flex flex-col gap-2">
          <h3 className="text-[25px] text-[#151515] border-b-2 border-b-blue-400 font-semibold">
            My Cart
          </h3>
          {/* <BreadCrumbs
            category={location?.pathname?.replace("/", "").split("-").join(" ")}
          /> */}
        </div>
      </div>
      {currentCart.length > 0 ? (
        <>
          <div className="w-[100%] mx-auto border mt-8 my-4">
            <div className="grid grid-cols-10 bg-red-500 py-3 text-white">
              <span className="col-span-6 font-semibold text-center">
                Product
              </span>
              <span className="col-span-1 font-semibold text-center">
                Quantity
              </span>
              <span className="col-span-3 font-semibold text-center">
                Price
              </span>
            </div>
            {currentCart &&
              currentCart?.map((el) => (
                <OrderItem
                  key={el._id}
                  el={el}
                  handleChangeQuantities={handleChangeQuantities}
                  defaultQuantity={el.quantity}
                />
              ))}
          </div>
          <div className="w-[100%] mx-auto flex justify-end items-center mb-4">
            <div className="flex flex-col">
              <div className=" flex items-center gap-2">
                <span className="font-normal">Subtotal: </span>
                <span className="font-medium text-main">
                  {numeral(
                    `${currentCart.reduce(
                      (sum, el) => sum + el?.price * el?.quantity,
                      0
                    )}`
                  ).format("0,0$")}
                </span>
              </div>
              <span className="mt-5">Shipping</span>
              <ButtonClick fw handleClick={handleUpdateAddress}>
                Check Out
              </ButtonClick>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-full gap-4">
          <span className="text-[50px] text-main">
            <BsFillBagHeartFill />
          </span>
          <p className="font-normal text-[30px] text-center">
            Currently your cart is empty, perhaps you have not added to cart or
            your cart has been checked out.
          </p>
          <span
            onClick={() => navigate(`/${path.MEMBER}/${path.HISTORY}`)}
            className="italic cursor-pointer text-main hover:underline"
          >
            Please go to your order history to view your purchased orders.
          </span>
        </div>
      )}
    </div>
  );
};

export default withBaseComponent(DetailCart);
