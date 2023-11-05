import React, { memo } from "react";

const SelectOptions = ({ icon }) => {
  return (
    <div className="w-[40px] h-[40px] flex justify-center items-center rounded-[20px] shadow-sm bg-white border cursor-pointer hover:bg-black hover:text-white hover:border-black transition-all">
      <span className="text-[20px]">{icon}</span>
    </div>
  );
};

export default memo(SelectOptions);
