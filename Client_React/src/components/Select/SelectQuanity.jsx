import React, { memo } from "react";

const SelectQuanity = ({ value, hanldeQuantity, handleChangeQuantity }) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-[150px] h-[40px]  flex justify-between items-center">
        <span
          onClick={() => handleChangeQuantity("minute")}
          className={`border-r w-[50px] text-center cursor-pointer ${
            +value === 1 ? "cursor-text" : ""
          }`}
        >
          -
        </span>
        <input
          className="w-[40px] outline-none text-center border-none"
          value={value}
          onChange={(e) => hanldeQuantity(e.target.value)}
          type="text"
        />
        <span
          onClick={() => handleChangeQuantity("plus")}
          className="border-l w-[50px] text-center cursor-pointer"
        >
          +
        </span>
      </div>
    </div>
  );
};

export default memo(SelectQuanity);
