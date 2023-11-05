import React, { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import path from "utils/path";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "store/users/asyncActions";
import { logout, clearMess } from "store/users/userSlice";
import Swal from "sweetalert2";
const TopHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, current, mes } = useSelector((state) => state.user);
  // console.log(current);
  //tại sao phải truyền dependencive?
  //Là vì nếu không có denpendencive thì nó chỉ gọi một lần khi load trang lần đầu nên khi ta login thì nó sẽ không load lại lần nữa nên ta sẽ không thấy user của mình
  useEffect(() => {
    if (isLoggedIn) {
      const setTimeoutId = setTimeout(() => {
        dispatch(getCurrent());
      }, 300);
      return () => {
        clearTimeout(setTimeoutId);
      };
    }
  }, [dispatch, isLoggedIn]);
  //Khi đăng nhập mà hết hạn thì trong useSlice sẽ cập nhật lại mes.
  //nên khi hết hạn đăng nhập thì sẽ có mes thì ta sẽ thông báo lỗi là hết phiên đăng nhập
  useEffect(() => {
    if (mes) {
      dispatch(clearMess());
      Swal.fire("Opp!", mes, "info").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
  }, [mes]);
  return (
    <div className="h-[40px] w-full bg-main flex justify-center items-center">
      <div className="w-main flex items-center justify-between text-[15px] text-white font-light">
        <span className="">ORDER ONLINE OR CALL US (+84) 398 232 567</span>
        {isLoggedIn && current ? (
          <small className="text-[15px] flex items-center gap-4">
            {`Welcom, ${current?.lastName} ${current?.firstName}`}
            <span
              onClick={() => dispatch(logout())}
              className="hover:rounded-md p-2 hover:bg-gray-300 hover:text-main cursor-pointer"
            >
              <AiOutlineLogout size={18} />
            </span>
          </small>
        ) : (
          <Link
            to={`/${path.LOGIN}`}
            className="cursor-pointer hover:text-black"
          >
            Sign In or Create Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);
