import { ButtonClick, ProductSellers } from "components";
import React from "react";
import { useSelector } from "react-redux";

const Wislist = () => {
  const { current } = useSelector((state) => state.user);

  return (
    <div className="w-full p-4">
      <header className="text-[25px] border-b-2 border-b-blue-400 font-semibold">
        WishList
      </header>
      <div className="flex gap-4 mt-5 w-full flex-wrap">
        {current?.wishlist?.map((el, index) => (
          <span key={index} className="bg-white py-2 w-[250px]">
            <ProductSellers normol={true} productData={el} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Wislist;
