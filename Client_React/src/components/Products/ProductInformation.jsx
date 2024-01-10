import React, { memo, useState, useCallback } from "react";
import { productInfomation } from "utils/contants";
import { ButtonClick, VoteBar, ModalVoteOptions, Comment } from "components";
import { renderStarNumber } from "utils/helpers";
import { apiRatings } from "apis/product";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "store/categories/appSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import path from "utils/path";
const ProductInformation = ({
  totalRatings,
  ratings,
  nameProduct,
  pid,
  re_rednder,
}) => {
  // console.log(ratings);
  const [active, setActive] = useState(1);
  const dispatch = useDispatch();
  const navi = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const handleScore = async (value) => {
    if (!value.comment || !value.score || !pid) {
      alert("Please vote when you submit!");
      return;
    }
    const response = await apiRatings({
      star: value.score,
      comment: value.comment,
      pid,
      updateAt: Date.now(),
    });
    //khi thành công hya thất bại đều làm mất modal đi
    re_rednder();
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    console.log(response);
  };
  const hanldevoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Are you sure?",
        text: "Login to vote!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navi(`/${path.LOGIN}`);
        }
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <ModalVoteOptions
              nameProduct={nameProduct}
              handleScore={handleScore}
            />
          ),
        })
      );
    }
  };
  return (
    <div>
      <div className="flex gap-2 relative bottom-[-1px]">
        {productInfomation?.map((item) => (
          <span
            className={` p-2 cursor-pointer ${
              active === item.id ? "bg-white border border-b-0" : "bg-[#f1f1f1]"
            }`}
            key={item.id}
            onClick={() => setActive(item.id)}
          >
            {item.name}
          </span>
        ))}
      </div>
      <div className="w-full border p-3">
        {productInfomation.some((el) => el.id === active) &&
          productInfomation.find((el) => el.id === active)?.content}
      </div>
      <div className="flex flex-col w-full mt-5 gap-2">
        <span className="">CUSTOMER REVIEWS</span>
        <div className="w-full">
          <div className="flex  w-full flex-col">
            <div className="flex gap-3">
              <div className="w-2/5 border border-red-400 p-4 flex items-center justify-center flex-col gap-2">
                <span className="text-[20px] font-medium text-gray-500">{`${totalRatings}/5`}</span>
                <span className="flex">
                  {renderStarNumber(totalRatings)?.map((e) => (
                    <span key={e}>{e}</span>
                  ))}
                </span>
                <span className="text-gray-500">{`${ratings?.length} reviews`}</span>
              </div>
              <div className="w-3/5 border p-4 gap-2 flex flex-col">
                {Array.from(Array(5).keys())
                  .reverse()
                  .map((el) => (
                    <VoteBar
                      key={el}
                      number={el + 1}
                      ratingTotal={ratings?.length}
                      ratingCount={
                        //lọc ra nhưng thằng nào star bằng với number thì đưa nó vào 1 mảng riêng
                        ratings?.filter((i) => i.star === el + 1)?.length
                      }
                    />
                  ))}
              </div>
            </div>
            <div className="flex justify-center items-center flex-col mt-10">
              <span>Do you reviews this product?</span>
              <ButtonClick handleClick={hanldevoteNow}>Rate now!</ButtonClick>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-5">
            {ratings &&
              ratings.map((el, index) => (
                <Comment
                  key={index}
                  comment={el.comment}
                  star={el.star}
                  updateAt={el.updateAt}
                  name={`${el.postedBy?.firstName} ${el.postedBy?.lastName}`}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductInformation);
