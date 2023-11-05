import React, { memo } from "react";

const CounDown = ({ init, time }) => {
  return (
    <div className="w-[30%] h-[60px] bg-[#f4f4f4] flex flex-col justify-center items-center">
      <span className="text-[18px]">{time}</span>
      <span className="text-[12px]">{init}</span>
    </div>
  );
};

export default memo(CounDown);
