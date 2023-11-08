import { SelectQuanity } from "components";
import React, { memo, useEffect, useState } from "react";
import numeral from "numeral";
import { apiRemoveCartUsers } from "apis/user";
import withBaseComponent from "hocs/withBaseComponent";
import { toast } from "react-toastify";
import { getCurrent } from "store/users/asyncActions";
const OrderItem = ({
  el,
  handleChangeQuantities,
  defaultQuantity = 1,
  dispatch,
}) => {
  // console.log(el);
  const [quantity, setQuantity] = useState(() => defaultQuantity);
  const hanldeQuantity = (number) => {
    if (!Number(number) || Number(number) < 1) {
      return;
    } else {
      setQuantity(number);
    }
  };
  const handleChangeQuantity = (flag) => {
    if (flag === "minute" && quantity === 1) return;
    if (flag === "minute") setQuantity((prev) => +prev - 1);
    if (flag === "plus") {
      setQuantity((prev) => +prev + 1);
    }
  };
  const handleRemoveCart = async (pid, color) => {
    const response = await apiRemoveCartUsers(pid, color);
    if (response.success) {
      dispatch(getCurrent());
    } else {
      toast.error(response.mes);
    }
  };
  useEffect(() => {
    handleChangeQuantities &&
      handleChangeQuantities(el.product?._id, quantity, el.color);
  }, [quantity]);
  return (
    <div className="grid grid-cols-10 py-3  w-full border-b">
      <span className="flex gap-4 items-center col-span-6 w-full">
        <img
          src={el?.thumbnail}
          alt=""
          className="w-24 h-24 object-cover ml-4"
        />
        <div className="flex flex-col gap-2 ">
          <span className="text-base text-main line-clamp-1 font-semibold">
            {el?.title}
          </span>
          <span className="text-xs">{el?.color}</span>
        </div>
      </span>
      <span className="col-span-1 w-full text-center">
        <div className="h-full flex items-center justify-center">
          <SelectQuanity
            value={quantity}
            hanldeQuantity={hanldeQuantity}
            handleChangeQuantity={handleChangeQuantity}
          />
        </div>
      </span>
      <span className="col-span-3 w-full  flex items-center justify-center gap-8">
        <div className="flex items-center justify-center h-full font-semibold">
          {numeral(el?.price * quantity).format("0,0$")}
        </div>
        <span
          onClick={() => handleRemoveCart(el.product?._id, el.color)}
          className="cursor-pointer text-main"
        >
          Delete
        </span>
      </span>
    </div>
  );
};

export default withBaseComponent(memo(OrderItem));
