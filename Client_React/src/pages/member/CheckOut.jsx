import React, { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import payment from "assets/payment.svg";
import number from "numeral";
import { AnimationPaypalSuccess, InputForm, PayPal } from "components";
import numeral from "numeral";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/users/asyncActions";
const CheckOut = ({ navigate, dispatch }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      //khi thanh toan thành công và khi reset lại giỏ hàng về [] thì phải dispatch để nó gọi apis lại để cập nhật lại giỏ hàng
      dispatch(getCurrent());
    }
  }, [isSuccess]);
  return (
    <div className="w-full grid grid-cols-10 gap-8 py-8 h-full max-h-screen">
      {isSuccess && <AnimationPaypalSuccess />}
      <div className="col-span-4 w-full flex justify-center items-center">
        <img src={payment} className="h-[70%] object-contain " alt="" />
      </div>
      <div className="col-span-6 flex flex-col px-4 w-full">
        <h2 className="font-medium text-[30px] text-blue-400 uppercase mb-8">
          Checkout your order
        </h2>
        <table className="table-auto border border-blue-300">
          <thead>
            <tr className="bg-blue-300 ">
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {currentCart.map((el) => (
              <tr key={el._id}>
                <td className="p-2 text-left">{el.title}</td>
                <td className="p-2 text-center">{el.quantity}</td>
                <td className="p-2 text-right">
                  {number(el.price * el.quantity).format("0,0$")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center gap-2 justify-end">
          <h2 className="font-semibold uppercase">Subtotal: </h2>
          <span className="text-main font-medium text-[20px]">
            {" "}
            {numeral(
              currentCart?.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue?.price * currentValue?.quantity,
                0
              )
            ).format("0,0$")}
          </span>
        </div>
        <div className="my-4 flex items-center gap-2 justify-start">
          <h2 className="font-semibold uppercase">Address: </h2>
          <span className="text-main font-medium text-[15px]">
            {current?.address}
          </span>
        </div>
        <div className="w-full">
          <PayPal
            amount={Math.round(
              currentCart?.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue?.price * currentValue?.quantity,
                0
              ) / +23500
            )}
            payload={{
              products: currentCart,
              total: Math.round(
                currentCart?.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue?.price * currentValue?.quantity,
                  0
                ) / +23500
              ),
              address: current?.address,
              status: "Successed",
            }}
            setIsSuccess={setIsSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(CheckOut));
