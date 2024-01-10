import { memo, useEffect, useState } from "react";
import { navi } from "utils/contants";
import { NavLink, createSearchParams, useParams } from "react-router-dom";
import useDebouce from "hooks/useDebouce";
import withBaseComponent from "hocs/withBaseComponent";
import { InputField } from "components";
import path from "utils/path";
const Navigation = ({ location, navigate }) => {
  const [queries, setQueries] = useState({
    q: "",
  });
  const { category } = useParams();
  const queriesDebouce = useDebouce(queries.q, 300);
  useEffect(() => {
    if (queriesDebouce) {
      if (category) {
        navigate({
          pathname: location.pathname,
          search: createSearchParams({ q: queriesDebouce }).toString(),
        });
      } else {
        navigate({
          pathname: `/${path.PRODUCTS}`,
          //tạo key trên url bằng với tên mà mình tìm kiếm
          search: createSearchParams({ q: queriesDebouce }).toString(),
        });
      }
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  }, [queriesDebouce]);
  return (
    <div className="w-main h-[48px] py-2 border-b flex items-center justify-between">
      <div>
        {navi?.map((el) => (
          <NavLink
            key={el.id}
            to={el.path}
            className={({ isActive }) =>
              isActive ? "pr-12 text-[14px] text-main" : "pr-12 hover:text-main"
            }
          >
            {el.value}
          </NavLink>
        ))}
      </div>
      <span>
        <InputField
          nameKey="q"
          value={queries.q}
          setValue={setQueries}
          placeholder={"Search product..."}
          isHideLabel
          style={"border-none text-sm focus:outline-none"}
        />
      </span>
    </div>
  );
};

export default withBaseComponent(memo(Navigation));
