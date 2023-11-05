import React, { memo } from "react";
import usePagination from "hooks/usePagination";
import { useSearchParams } from "react-router-dom";
import { PagiItem } from "..";
const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, +params.get("page") || 1);
  // console.log(usePagination(68, 4));
  const range = () => {
    //lấy trang mà ng dùng vừa click
    const currentPage = +params.get("page");
    //đặt số product khi nó hiển thị lên
    const pageSize = +process.env.REACT_APP_LIMIT || 10;
    //số product bắt đầu
    const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
    //số product kết thúc dùng in để lấy số nhỏ hơn
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} - ${end}`;
  };
  return (
    <div className="flex items-center justify-between w-full mt-5">
      {!+params.get("page") && (
        <span className="italic text-sm">{`Show products ${Math.min(
          totalCount,
          1
        )} - ${Math.min(
          +process.env.REACT_APP_LIMIT,
          totalCount
        )} of ${totalCount} products`}</span>
      )}
      {/* trường hợp có page */}
      {+params.get("page") ? (
        <span className="italic text-sm">
          {`Show products ${range()} of ${totalCount} products`}
        </span>
      ) : (
        ""
      )}
      <div className="flex items-center">
        {pagination?.map((p, i) => (
          <PagiItem key={i}>{p}</PagiItem>
        ))}
      </div>
    </div>
  );
};

export default memo(Pagination);
