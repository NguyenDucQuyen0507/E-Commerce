import React, { memo, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { colors } from "utils/contants";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { apiGetProduct } from "apis/product";
import useDebouce from "hooks/useDebouce";
import { useEffect } from "react";
import numeral from "numeral";
const FilterSearch = ({ name, active, handleActive, type = "checkbox" }) => {
  const [params] = useSearchParams();
  const { category } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [priceProduct, setPriceProduct] = useState(null);
  const [price, setPrice] = useState({
    from: "",
    to: "",
  });
  const hanldeClick = (e) => {
    const already = selected.find((el) => el === e.target.value);
    if (already) {
      setSelected((els) => els.filter((el) => el !== e.target.value));
    } else {
      //them vào mảng: giữ lại giá trị cũ và thêm giá trị mới
      setSelected((prev) => [...prev, e.target.value]);
      //2 cái ở dưới thì chỉ trả về độ dài của mảng, khi đó khi lên find thì nó sẽ không tìm thấy giá trị
      // setSelected((prev) => prev.push(e.target.value));
      // return prev;
    }
  };
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    //Lặp qua các params để ta có thể lưu trữ hết tất cả giá trị vừa nhập
    const queries = {};
    for (let i of params) {
      queries[i[0]] = i[1];
    }
    if (selected.length > 0) {
      queries.color = selected.join(",");
      //Khi ta ở trang 2 mà sp chỉ có đủ cho trang 1 hiển thị thì ta sẽ cho nó về lại trang 1
      queries.page = 1;
    }
    //select < 0 thì chỉ xóa color và giữ các tìm kiếm khác
    else delete queries.color;
    navigate({
      pathname: `/${category}`,
      search: `?${createSearchParams(queries).toString()}`,
    });
  }, [selected]);

  const fetchMaxPriceProduct = async () => {
    const response = await apiGetProduct({ sort: "-price", limit: "1" });
    if (response.success) {
      setPriceProduct(response.products[0].price);
    }
  };
  useEffect(() => {
    if (type === "input") {
      fetchMaxPriceProduct();
    }
  }, [type]);
  //kt from phải nhỏ hơn to
  useEffect(() => {
    if (+price.from && +price.to > +price.to) {
      alert("From price cannot greater than To price");
    }
  }, [price]);
  //làm phần lọc theo giá
  const useDebouceFrom = useDebouce(price.from, 500);
  const useDebouceTo = useDebouce(price.to, 500);
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of params) {
      queries[i[0]] = i[1];
    }
    if (Number(price.from) > 0) queries.from = price.from;
    //nếu nó nhỏ hơn không nghĩa là người dùng click nút reset thì chỉ xóa đi price.from chứ không xóa các tìm kiếm  còn lại
    else delete queries.from;
    if (Number(price.to) > 0) queries.to = price.to;
    else delete queries.to;
    //Khi ta ở trang 2 mà sp chỉ có đủ cho trang 1 hiển thị thì ta sẽ cho nó về lại trang 1
    // console.log(queries);
    queries.page = 1;
    // console.log(queries); => {page : 1}
    console.log(createSearchParams(queries).toString());
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [useDebouceFrom, useDebouceTo]);
  return (
    <div
      onClick={() => handleActive(name)}
      className="text-sm border border-gray-800 px-3 h-[45px] flex justify-between items-center gap-6 cursor-auto  capitalize relative"
    >
      <span>{name}</span>
      <AiOutlineDown />
      {active === name && (
        <div className="absolute top-[calc(100%+2px)] left-[-1px] bg-white border w-fit min-w-[250px] z-50">
          {type === "checkbox" && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4">
                <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected([]);
                    handleActive(null);
                  }}
                  className="cursor-pointer hover:text-main underline"
                >
                  Reset
                </span>
              </div>
              <div className="border-t p-4">
                {colors.map((el, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      onChange={hanldeClick}
                      value={el}
                      type="checkbox"
                      id={el}
                      className="w-4 h-4"
                      checked={selected.some(
                        (selectedItem) => selectedItem === el
                      )}
                    />
                    <label className="text-[17px]" htmlFor={el}>
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "input" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="p-4 flex flex-col gap-5"
            >
              <div className="flex justify-between items-center">
                <span className="">{`The highest price is ${numeral(
                  priceProduct
                ).format("0,0$")} `}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrice({ from: "", to: "" });
                    handleActive(null);
                  }}
                  className="cursor-pointer hover:text-main underline"
                >
                  Reset
                </span>
              </div>
              <hr />
              <div className="flex gap-3">
                <div className="flex gap-3 items-center">
                  <label htmlFor="Form">From</label>
                  <input
                    className="border border-gray-400 py-3 px-1"
                    type="number"
                    id="Form"
                    value={price.from}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, from: e.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <label htmlFor="to">To</label>
                  <input
                    className="border border-gray-400 py-3 px-1"
                    type="number"
                    id="to"
                    value={price.to}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, to: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(FilterSearch);
