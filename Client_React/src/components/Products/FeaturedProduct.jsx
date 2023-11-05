import React, { useState, useEffect, memo } from "react";
import { apiGetProduct } from "apis/product";
import { FeaturedProducts } from "..";
import feature1 from "assets/feature1.png";
import feature2 from "assets/feature2.png";
import feature3 from "assets/feature3.png";
import feature4 from "assets/feature4.png";

const FeaturedProduct = () => {
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const getProductFeatured = async () => {
    const response = await apiGetProduct({
      limit: 9,
      sort: "-totalRatings",
    });
    if (response.success) {
      setFeaturedProduct(response.products);
    }
  };
  useEffect(() => {
    getProductFeatured();
  }, []);
  return (
    <div className="w-full">
      <div className="w-full flex flex-col">
        <h2 className="text-[20px] font-medium border-b-2 border-main pb-2 ">
          FEATURED PRODUCTS
        </h2>
        <div className="flex flex-wrap mx-[-10px] mt-[20px]">
          {featuredProduct &&
            featuredProduct.map((pro, index) => (
              <FeaturedProducts key={index} featuredProduct={pro} />
            ))}
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[800px]">
        <img
          src={feature1}
          alt=""
          className="w-full h-full col-span-2 row-span-2 object-cover"
        />
        <img
          src={feature2}
          alt=""
          className="w-full h-full col-span-1 row-span-1 object-cover"
        />
        <img
          src={feature4}
          alt=""
          className="w-full h-full col-span-1 row-span-2 object-cover"
        />
        {/* Khi đủ 4 cột nhưng feature 2 chỉ chiếm 1 hàng nên thằng feature3 nó sẽ lắp vào vị trí của feature 2  */}
        <img
          src={feature3}
          alt=""
          className="w-full h-full col-span-1 row-span-1 object-cover"
        />
      </div>
    </div>
  );
};

export default memo(FeaturedProduct);
