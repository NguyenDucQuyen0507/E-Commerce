import React, { memo } from "react";
import withBaseComponent from "hocs/withBaseComponent";
import { AiOutlineCloseCircle, AiOutlineDelete } from "react-icons/ai";
import { BsFillBagFill } from "react-icons/bs";
import { showCart } from "store/categories/appSlice";
import { useSelector } from "react-redux";
import numeral from "numeral";
import { ButtonClick } from "components";
import { apiRemoveCartUsers } from "apis/user";
import { getCurrent } from "store/users/asyncActions";
import { toast } from "react-toastify";
import path from "utils/path";
const YourCart = ({ dispatch, navigate }) => {
  const { currentCart } = useSelector((state) => state.user);
  console.log(currentCart);
  const handleRemoveCart = async (pid, color) => {
    const response = await apiRemoveCartUsers(pid, color);
    if (response.success) {
      dispatch(getCurrent());
    } else {
      toast.error(response.mes);
    }
  };
  const handleDetailCart = () => {
    dispatch(showCart());
    navigate(`/${path.MEMBER}/${path.CART}`);
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="grid grid-rows-10 w-[400px] bg-black h-screen text-white p-8 relative"
    >
      <header className="row-span-1 max-h-full flex justify-between border-b-2 border-gray-500 py-4 z-[1000]">
        <span className="font-bold uppercase">Your Cart</span>
        <span onClick={() => dispatch(showCart())} className="cursor-pointer">
          <AiOutlineCloseCircle size={"28px"} />
        </span>
      </header>
      <section className="row-span-7 h-full max-h-full flex flex-col gap-3 py-8 overflow-y-auto">
        {!currentCart?.length && (
          <div className="flex justify-center items-center h-full gap-4">
            <BsFillBagFill color="red" />
            <span>Your cart is empty</span>
          </div>
        )}
        {currentCart &&
          currentCart?.map((el) => (
            <div key={el._id} className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img
                  src={el?.thumbnail}
                  alt=""
                  className="w-20 h-20 object-cover"
                />
                <div className="flex flex-col gap-1 ">
                  <span className="text-sm text-main line-clamp-1">
                    {el?.title}
                  </span>
                  <span className="text-xs">{el?.color}</span>
                  <span className="text-xs">{`Quantity: ${el?.quantity}`}</span>
                  <span className="text-sm">
                    {numeral(el?.price).format("0,0$")}
                  </span>
                </div>
              </div>
              <span
                onClick={() => handleRemoveCart(el.product?._id, el.color)}
                className="mr-4 p-1 hover:bg-white rounded cursor-pointer"
              >
                <AiOutlineDelete color="red" size={"16px"} />
              </span>
            </div>
          ))}
      </section>
      <div className="row-span-2 h-full max-h-full flex flex-col">
        <div className="flex gap-4 pt-4 border-t">
          <span className="uppercase">Subtotal:</span>
          <span>
            {numeral(
              currentCart?.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue?.price * currentValue?.quantity,
                0
              )
            ).format("0,0$")}
          </span>
        </div>
        <span className="text-xs italic ...">Shipping</span>
        <ButtonClick handleClick={handleDetailCart} fw>
          SHOPPING CART
        </ButtonClick>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(YourCart));
