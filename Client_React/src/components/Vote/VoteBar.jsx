import React, { useRef, useEffect, memo } from "react";
import { AiFillStar } from "react-icons/ai";
const VoteBar = ({ number, ratingCount, ratingTotal }) => {
  const percentRef = useRef();
  // console.log(ratingTotal, ratingCount);
  useEffect(() => {
    //* lấy số sao nhân với 100 là để lấy phần trăm, round là để làm tròn số.
    // Tổng số người đánh giá
    const percent = Math.round((ratingCount * 100) / ratingTotal) || 0;
    //nếu 2 tham số không có giá trị thì nó sẽ lsaay là 0
    percentRef.current.style.right = ` ${100 - percent}%`;
    //* percentRef là useRef của ô mình cần thay đổi .current là lấy dom của ô đó .style.right là thay đổi css cho thằng right.
  }, [ratingCount, ratingTotal]);
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <div className="flex items-center justify-center gap-2 w-[10%]">
        <span>{number}</span>
        <AiFillStar color="orange" />
      </div>
      <div className="w-[75%]">
        <div className="relative w-full h-[5px] bg-gray-200 rounded-2xl">
          <div
            ref={percentRef}
            className="absolute inset-0 bg-red-500 rounded-2xl "
          ></div>
        </div>
      </div>
      <div className="w-[15%]">{`${ratingCount || 0} reviews`}</div>
    </div>
  );
};

export default memo(VoteBar);
