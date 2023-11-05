import React, { memo } from "react";
import { ProductSellers } from "..";
import Slider from "react-slick";
const CustomSlide = ({
  products,
  active,
  normol,
  setVarient,
  setCurrentProducts,
}) => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  return (
    <Slider className="customer-slider" {...settings}>
      {products?.map((item, index) => (
        <ProductSellers
          key={index}
          productData={item}
          isNew={active === 1 ? true : false}
          normol={normol}
          setVarient={setVarient}
          setCurrentProducts={setCurrentProducts}
        />
      ))}
    </Slider>
  );
};

export default memo(CustomSlide);
