import React, { memo } from "react";
import {
  useSearchParams,
  useParams,
  useNavigate,
  createSearchParams,
  useLocation,
} from "react-router-dom";
const PagiItem = ({ children }) => {
  const navigate = useNavigate();
  const locate = useLocation();
  const [params] = useSearchParams();
  //Dùng .get("page") để kt có só trang đang là trang số mấy để nó có bằng với children vừa click hay không.
  // console.log(params.get("page"));
  const handlePagination = () => {
    //khi nó truyền lên param thì thằng này dùng để xem kq
    let param = [];
    for (let i of params.entries()) param.push(i);
    //dùng để tạo key và value khi mình click vào một số cụ thể thì no sẽ thay đổi và truyền lên params
    const queries = {};
    for (let i of params) {
      queries[i[0]] = i[1];
    }
    //kt và tạo key là page
    if (Number(children)) {
      queries.page = children;
    }
    // console.log(queries);
    //đưa lên url
    navigate({
      pathname: locate.pathname,
      search: `?${createSearchParams(queries).toString()}`,
    });
  };
  return (
    <button
      className={`w-[30px] h-[30px] flex justify-center hover:rounded-full hover:bg-gray-300  ${
        !Number(children) ? "items-end pb-1" : "items-center"
      } ${
        +params.get("page") === +children ? "rounded-full bg-gray-300" : ""
      } ${
        !+params.get("page") && +children === 1 && "rounded-full bg-gray-300"
      }  `}
      onClick={handlePagination}
      type="button"
      disabled={!Number(children)}
    >
      {children}
    </button>
  );
};

export default memo(PagiItem);
