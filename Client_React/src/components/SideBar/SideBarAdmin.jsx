import React, { Fragment, useState, memo } from "react";
import logo from "assets/logo.png";
import { NavLink, Link } from "react-router-dom";
import { adminSideBar } from "utils/contants";
import { AiOutlineCaretDown } from "react-icons/ai";
import path from "utils/path";
const activedStyle =
  "px-4 py-2 flex items-center gap-2 text-white bg-blue-500 ";
const notActivedStyle =
  "px-4 py-2 flex items-center gap-2 text-white hover:bg-blue-500";
const SideBarAdmin = () => {
  const [active, setActive] = useState([]);
  const handleShowtabs = (tabId) => {
    //nó sẽ tìm trong mảng có thằng id đó không, nếu có thì true, sau đó sẽ xóa thằng đó khỏi mảng bằng cách lọc những ra những thằng còn lại.
    if (active.some((el) => el === tabId)) {
      setActive((prev) => prev.filter((el) => el !== tabId));
    } else {
      //Nếu chưa có thì thêm id đó vào mảng
      setActive((prev) => [...prev, tabId]);
    }
  };
  return (
    <div className="bg-blue-300 h-full py-4">
      <Link
        to={`${path.PUBLIC}`}
        className="flex flex-col justify-center items-center gap-2 p-4"
      >
        <img src={logo} alt="" className="w-[200px] object-cover" />
        <p className="font-normal text-[20px] text-white">Admin work space</p>
      </Link>
      <div>
        {adminSideBar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                // key={el.id}
                to={el.path}
                className={({ isActive }) =>
                  isActive ? activedStyle : notActivedStyle
                }
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === "PARENT" && (
              <div>
                <div
                  onClick={() => handleShowtabs(el.id)}
                  className="flex items-center justify-between px-4 gap-2 text-white py-2 hover:bg-blue-500 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </div>
                  <AiOutlineCaretDown />
                </div>
                {/* Kiểm tra nếu có id trong mảng mới show ra */}
                {active.some((id) => id === el.id) && (
                  <div className="pl-4">
                    {el.subMenu.map((el) => (
                      <NavLink
                        key={el.text}
                        to={el.path}
                        className={({ isActive }) =>
                          isActive ? activedStyle : notActivedStyle
                        }
                      >
                        {el.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(SideBarAdmin);
