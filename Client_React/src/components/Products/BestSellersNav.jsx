import { useEffect, useState, memo } from "react";
import { apiGetProduct } from "apis/product";
import { CustomSlide } from "..";
import { getProducts } from "store/products/asyncActions";
import { useSelector, useDispatch } from "react-redux";
const tabs = [
  {
    id: 1,
    name: "best sellers",
  },
  {
    id: 2,
    name: "new arrivals",
  },
];
const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [active, setActive] = useState(1);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.products);
  const fetchProduct = async () => {
    // const [bestSeller, newProduct] = await Promise.all([
    //   //Vì ở bên apiGetProducts ta có truyền vào params làm tham số nên ở đây khi gọi mình cũng truyền vào params.
    //   //sort ở đây là ở phần api mình đã query cho nó.
    //   //-sold là lấy từ cao xuống thấp
    //   apiGetProducts({ sort: "-sold" }),
    //   apiGetProducts({ sort: "-createdAt" }),
    // ]);
    const response = await apiGetProduct({ sort: "-sold" });
    if (response.success) {
      setBestSellers(response?.products);
      //cập nhật vào product để set active
      setProducts(response?.products);
    }
    // if (newProduct?.success) {
    //   setNewProductsDay(newProduct?.products);
    //   //cập nhật vào product để set active
    //   setProducts(newProduct?.products);
    // }
  };
  useEffect(() => {
    fetchProduct();
    dispatch(getProducts());
  }, []);
  useEffect(() => {
    if (active === 1) setProducts(bestSellers);
    if (active === 2) setProducts(newProducts);
  }, [active]);
  return (
    <div>
      <div className="flex gap-5 text-[20px] pb-4 border-b-2 border-main">
        {tabs.map((item, index) => (
          <span
            className={`cursor-pointer font-medium uppercase border-r pr-4 text-gray-500 ${
              active === item.id ? "text-gray-900" : ""
            }`}
            key={index}
            onClick={() => setActive(item.id)}
          >
            {item.name}
          </span>
        ))}
      </div>
      <div className="mt-4 mx-[-10px]">
        <CustomSlide products={products} active={active} />
      </div>
      <div className="flex gap-4 w-full mt-4">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt="banner"
          className="object-contain flex-1"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt="banner"
          className="object-contain flex-1"
        />
      </div>
    </div>
  );
};

export default memo(BestSeller);
