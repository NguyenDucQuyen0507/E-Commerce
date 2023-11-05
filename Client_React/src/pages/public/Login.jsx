import React, { useState, useCallback, useEffect } from "react";
import { InputField, ButtonClick, Loading } from "../../components";
import {
  apiRegister,
  apiLogin,
  apiForgotPassword,
  apiFinalRegister,
} from "../../apis/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "../../utils/path";
import Swal from "sweetalert2";
import { login } from "../../store/users/userSlice";
import { showModal } from "store/categories/appSlice";
import { useDispatch } from "react-redux";
import { validate } from "utils/helpers";
const Login = () => {
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // console.log(params.get("redirect"));
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassWord] = useState(false);
  //taoj useState để làm chức năng quên mạt khẩu
  const [email, setEmail] = useState("");
  //validateForm
  const [invalidateField, setInvalidateField] = useState([]);
  //nhập token từ email
  const [token, setToken] = useState("");
  //xử lý ẩn hiện input nhập token
  const [isVeryfiToken, setIsVeryfiToken] = useState(false);
  //reset lại trang register
  useEffect(() => {
    resetInput();
  }, [isRegister]);
  const resetInput = () => {
    setPayload({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
    });
  };
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      Swal.fire("Congratulations", response.mes, "success");
    } else {
      Swal.fire("Opp!", response.mes, "error");
    }
  };
  const handleSubmit = useCallback(async () => {
    const { firstName, lastName, mobile, ...data } = payload;
    const invalids = isRegister
      ? validate(payload, setInvalidateField)
      : validate(data, setInvalidateField);
    //invalids nó sẽ trả về số, nếu là 0 thì tất cả các field đã được điền khi nó mới cho phép gọi api
    console.log(invalids);
    if (invalids === 0) {
      if (isRegister) {
        //khi đang load thì xuất hiện modal loading
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        const response = await apiRegister(payload);
        //khi có dc response thì modal loading sẽ ẩn đi
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
          setIsVeryfiToken(true);
          // Swal.fire("Congratulation", response.mes, "success").then(() => {
          //   //chuyển nó về trang login
          //   setIsRegister(false);
          //   //reset lại các ô input
          //   resetInput();
          // });
        } else {
          Swal.fire("Opps!", response.mes, "error");
        }
        // const response = await axios.post("/user/register", payload);
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          dispatch(
            login({
              isLoggedIn: true,
              current: rs.userData,
              token: rs.accessToken,
            })
          );
          params.get("redirect")
            ? navigate(params.get("redirect"))
            : navigate(`/${path.HOME}`);
        } else {
          Swal.fire("Opps!", rs.mes, "error");
        }
      }
    } else {
    }
  }, [payload, isRegister]);
  // console.log("", invalidateField);
  const handleSubmitToken = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire("Congratulation", response.mes, "success").then(() => {
        //chuyển nó về trang login
        setIsRegister(false);
        setIsVeryfiToken(false);
        //reset lại các ô input
        resetInput();
      });
    } else {
      Swal.fire("Opps!", response.mes, "error");
      setToken("");
      // setIsVeryfiToken(false);
    }
  };
  const hanldeCreate = () => {
    //khi chuyển trang sẽ mất thông báo lỗi ở input
    setInvalidateField([]);
    setIsRegister(true);
  };
  const hanldeLogin = () => {
    setInvalidateField([]);
    setIsRegister(false);
  };
  return (
    <div className="w-screen h-screen relative">
      {isVeryfiToken && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[20] bg-overlay">
          <div className="bg-white w-[500px] p-6 rounded-[20px] flex flex-col items-center gap-4">
            <p className="text-blue-500 font-light">
              We send a code for you. Please check and fill here
            </p>
            <div className="flex items-center gap-4">
              <input
                className="border outline-none p-2"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                type="text"
              />
              <ButtonClick
                handleClick={handleSubmitToken}
                style="px-4 py-2 rounded-md text-white bg-main hover:bg-[#333] font-medium "
              >
                Submit
              </ButtonClick>
            </div>
          </div>
        </div>
      )}
      {isForgotPassword && (
        <div
          className={`absolute top-0 bottom-0 right-0 left-0 bg-white flex justify-center z-30 pt-8 ${
            isForgotPassword ? "animate-slide-right" : "animate-slide-left"
          }`}
        >
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Enter your email: </label>
            <input
              type="text"
              className="w-[500px] border-b outline-none placeholder:text-sm"
              id="email"
              placeholder="Exp: email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className=" w-full flex justify-center gap-8">
              <ButtonClick
                name="Back"
                handleClick={() => setIsForgotPassWord(!isForgotPassword)}
                style="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-[#333] font-medium mt-5"
              />
              <ButtonClick name="Submit" handleClick={handleForgotPassword} />
            </div>
          </div>
        </div>
      )}
      <img
        className="w-full h-full object-cover"
        src="https://img.freepik.com/premium-vector/cart-supermarket-low-poly-wireframe-online-shopping-ecommerce-concept_252172-138.jpg"
        alt=""
      />
      <div className="absolute top-0 right-1/2 left-0 bottom-0 flex justify-center items-center">
        <div
          className={`${
            isRegister ? "w-[600px]" : "w-[400px]"
          }  bg-white p-4 px-8 rounded-[20px]`}
        >
          <h1 className="text-[20px] text-main font-semibold text-center">
            {isRegister ? "Register" : "Login"}
          </h1>
          <div className="flex flex-col gap-3 mt-8">
            {isRegister && (
              <div className="flex gap-2">
                <InputField
                  value={payload.firstName}
                  setValue={setPayload}
                  //nameKey phải trùng với tên của value để có thẻ setValue đúng với giá trị trong value
                  nameKey="firstName"
                  invalidateField={invalidateField}
                  //truyền props này dùng để focus vào thì nó trở về mảng rỗng nên koh xúuất hiện lỗi
                  setInvalidateField={setInvalidateField}
                  fullWith
                />
                <InputField
                  value={payload.lastName}
                  setValue={setPayload}
                  //nameKey phải trùng với tên của value để có thẻ setValue đúng với giá trị trong value
                  nameKey="lastName"
                  invalidateField={invalidateField}
                  setInvalidateField={setInvalidateField}
                  fullWith
                />
              </div>
            )}
            {isRegister && (
              <InputField
                value={payload.mobile}
                setValue={setPayload}
                //nameKey phải trùng với tên của value để có thẻ setValue đúng với giá trị trong value
                nameKey="mobile"
                invalidateField={invalidateField}
                setInvalidateField={setInvalidateField}
              />
            )}

            <InputField
              value={payload.email}
              setValue={setPayload}
              nameKey="email"
              type="email"
              invalidateField={invalidateField}
              setInvalidateField={setInvalidateField}
            />
            <InputField
              value={payload.password}
              setValue={setPayload}
              nameKey="password"
              type="password"
              invalidateField={invalidateField}
              setInvalidateField={setInvalidateField}
            />
            <ButtonClick fw handleClick={handleSubmit}>
              {isRegister ? "Register" : "Login"}
            </ButtonClick>
            <div className="flex items-center justify-between text-xs w-full">
              {!isRegister && (
                <span
                  onClick={() => setIsForgotPassWord(!isForgotPassword)}
                  className="text-blue-400 italic hover:underline cursor-pointer"
                >
                  Forgot your account?
                </span>
              )}
              {!isRegister && (
                <span
                  onClick={hanldeCreate}
                  className="text-blue-400 italic hover:underline cursor-pointer"
                >
                  Create account?
                </span>
              )}
              {isRegister && (
                <span
                  onClick={hanldeLogin}
                  className="text-blue-400 italic hover:underline cursor-pointer text-center w-full"
                >
                  Go login
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
