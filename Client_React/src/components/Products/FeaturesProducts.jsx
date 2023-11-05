import React, { memo } from "react";
import { renderStarNumber } from "utils/helpers";
import numeral from "numeral";

const FeaturesProducts = ({ featuredProduct }) => {
  return (
    <div className="w-1/3 flex-auto px-[10px] ">
      <div className="border p-[15px] gap-4 flex items-center mb-[20px]">
        <img
          src={featuredProduct?.thumb}
          alt=""
          className="w-[90px] object-contain"
        />
        <div className="flex flex-col gap-1 items-start">
          <p className="flex text-yellow-400 h-4">
            {renderStarNumber(featuredProduct?.totalRatings)?.map(
              (star, index) => (
                <span key={index}>{star}</span>
              )
            )}
          </p>
          <p className="line-clamp-1 text-[15px]">{featuredProduct?.title}</p>
          <p className="text-[15px]">
            {numeral(featuredProduct?.price).format("0,0$")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(FeaturesProducts);
