import React, { memo } from "react";

const ProductExtra = ({ sub, title, icon }) => {
  return (
    <div className="flex items-center gap-2 mb-[10px] border p-2">
      <span className="p-2 rounded-full bg-gray-800 text-white flex items-center justify-center">
        {icon}
      </span>
      <div className="flex flex-col text-sm">
        <span>{title}</span>
        <span className="text-text">{sub}</span>
      </div>
    </div>
  );
};

export default memo(ProductExtra);
