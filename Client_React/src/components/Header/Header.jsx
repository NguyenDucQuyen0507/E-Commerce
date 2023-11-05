import { Fragment, memo, useState, useRef, useEffect } from "react";
import { BsTelephoneFill, BsFillBagFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { BiUser, BiUserCheck } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";
import { GrUserAdmin } from "react-icons/gr";
import logo from "assets/logo.png";
import { Link } from "react-router-dom";
import path from "utils/path";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/users/userSlice";
import { showCart } from "store/categories/appSlice";
const Header = () => {
  const { current } = useSelector((state) => state.user);
  const [isShowOption, setIsShowOption] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  useEffect(() => {
    //Coi kĩ trong bài 71 .txt
    const hanldeClosedMenu = (event) => {
      // const menu = document.getElementById("profile");
      // console.log(menuRef.current);
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        //menuRef.current là nó kt có tồn tại dom đó không
        // ("!")menuRef.current.contains(event.target) là người dùng không click vào thẻ menuRef mà click ra bên ngoài.
        setIsShowOption(false);
      }
    };
    // Thêm sự kiện click vào body để xác định khi người dùng click ra bên ngoài menu
    document.addEventListener("click", hanldeClosedMenu);
    // Loại bỏ sự kiện khi component bị unmount
    // Việc này giúp tránh lỗi và vấn đề bảo mật có thể xảy ra khi bạn không loại bỏ sự kiện.
    return () => {
      document.removeEventListener("click", hanldeClosedMenu);
    };
  }, []);

  return (
    <div className="border-b w-main h-[110px] py-[35px] flex justify-between">
      <Link to={path.HOME}>
        <img src={logo} alt="logo" className="w-[234px] object-contain" />
      </Link>
      <div className="flex text-[13px] ">
        <div className="flex flex-col items-center px-4 border-r">
          <span className="flex gap-4 items-center">
            <BsTelephoneFill color="red" />
            <span className="font-semibold">0398232567</span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className="flex flex-col items-center px-4 border-r">
          <span className="flex gap-4 items-center">
            <MdEmail color="red" />
            <span className="font-semibold">SUPPORT@TADATHEMES.COM</span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        {current && (
          <Fragment>
            <div
              onClick={() => dispatch(showCart())}
              className="flex items-center justify-center gap-2 px-4 border-r cursor-pointer"
            >
              <BsFillBagFill color="red" />
              <span>{`${current?.cart?.length || 0} item(s)`}</span>
            </div>

            <div
              ref={menuRef}
              id="profile"
              onClick={() => setIsShowOption(!isShowOption)}
              className="flex items-center justify-center gap-2 px-4 cursor-pointer relative"
            >
              <BiUser color="red" />
              <span>Profile</span>
              {isShowOption && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute flex flex-col gap-1 top-full bg-gray-300 left-[5px] min-w-[160px] rounded-md overflow-hidden"
                >
                  <Link
                    to={`/${path.MEMBER}/${path.PERSONAL}`}
                    className="p-2 hover:bg-blue-300 w-full flex gap-2 items-center"
                  >
                    <span>
                      <BiUserCheck size={"18px"} />
                    </span>
                    <span>Personal</span>
                  </Link>
                  {current.role === 1 && (
                    <Link
                      to={`${path.ADMIN}/${path.DASHBOARD}`}
                      className="p-2 hover:bg-blue-300 w-full flex gap-2 items-center"
                    >
                      <span>
                        <GrUserAdmin size={"18px"} />
                      </span>
                      <span>Admin workspace</span>
                    </Link>
                  )}
                  <span
                    onClick={() => dispatch(logout())}
                    className="p-2 hover:bg-blue-300 w-full flex gap-2 items-center text-red-500"
                  >
                    <span>
                      <AiOutlineLogout size={"18px"} />
                    </span>
                    <span>Logout</span>
                  </span>
                </div>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default memo(Header);
