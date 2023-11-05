import { memo } from "react";
import { navi } from "utils/contants";
import { NavLink } from "react-router-dom";
const Navigation = () => {
  return (
    <div className="w-main h-[48px] py-2 border-b flex items-center">
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
  );
};

export default memo(Navigation);
