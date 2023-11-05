import { React, useState, useEffect, memo } from "react";
import numeral from "numeral";
import moment from "moment";
import { apiGetProduct } from "apis/product";
import { AiFillStar } from "react-icons/ai";
import { HiOutlineMenu } from "react-icons/hi";
import { CounDown } from "components";
import { renderStarNumber, secondsToHms } from "utils/helpers";
let timeDown;
const DealDaily = () => {
  const [dailiProduct, setDailiProduct] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(false);
  const fetchProducts = async () => {
    const response = await apiGetProduct({
      limit: 1,
      page: Math.round(Math.random() * 5),
      totalRatings: 5,
    });
    //trong  serer mình đã check lấy sp, limit ở đây là muốn lấy bao nhiu sp và ở trang nào
    //ta random để nó lấy sp ở trang khác
    //tính giờ thật
    // const h = 24 - new Date().getHours();
    // const m = 60 - new Date().getMinutes();
    // const s = 60 - new Date().getSeconds();
    if (response.success) {
      setDailiProduct(response.products[0]);
      //lấy 5h ngày hôm nay lam cot moc
      const today = `${moment().format("MM/DD/YYYY")} 5:00:00`;
      //tính số s trong 5h ngày hôm nay + cho 1 ngày nghĩa là lúc này nó là 5h của ngày hôm sau
      // - đi số giờ phút giây hiện tại nó sẽ còn lại số giấy từ bây h đến 5h ngày hôm sau
      //Ta lấy ngày hôm sau trừ cho thời gian hiện tại là còn tg từ bây h đến ngày hôm sau là cái mà ta cần lấy
      const second =
        new Date(today).getTime() + 24 * 3600 * 1000 - new Date().getTime();
      // console.log("second: " + second);
      const number = secondsToHms(second);
      setHours(number.h);
      setMinutes(number.m);
      setSeconds(number.s);
    } else {
      setHours(0);
      setMinutes(59);
      setSeconds(59);
    }
  };
  //Đầu tiên khi render lần đầu nó sẽ gọi data, khi mà time bên useEffect thứ 2 thay đổi thì nó sẽ dựa vào dependencive
  //và nó sẽ gọi lại api
  useEffect(() => {
    fetchProducts();
    clearInterval(timeDown);
    //khi gọi lại api thì nó sẽ xóa tg hiện tại và cập nhật lại tg mới
  }, [time]);

  useEffect(() => {
    timeDown = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else {
        if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          if (hours > 0) {
            setHours((prev) => prev - 1);
            setMinutes(59);
          } else {
            setTime(!time);
          }
        }
      }
    }, 1000);
    //phải có clearInterval để dừng việc thay đổi không cần thiết
    return () => {
      clearInterval(timeDown);
    };
  }, [seconds, minutes, hours, time]);
  return (
    <div className="border w-full flex-auto p-4">
      <div className="flex justify-between items-center">
        <span>
          <AiFillStar className="text-[#d11] text-[20px]" />
        </span>
        <span className="text-[20px] font-medium opacity-[0.8]">
          DAILY DEALS
        </span>
        <span></span>
      </div>
      <div className="flex flex-col gap-7">
        <img
          className="mt-8 w-full"
          src={
            dailiProduct?.thumb ||
            "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg"
          }
          alt=""
        />
        <div className="flex flex-col gap-1 text-center">
          <p className="flex text-yellow-400 h-4 justify-center">
            {renderStarNumber(dailiProduct?.totalRatings)?.map(
              (star, index) => (
                <span key={index}>{star}</span>
              )
            )}
          </p>
          <p className="text-[20px] opacity-[0.8]">{dailiProduct?.title}</p>
          <p>{numeral(dailiProduct?.price).format("0,0$")}</p>
        </div>
      </div>
      <div className="flex flex-col gap-7 mt-7">
        <div className="flex gap-2">
          <CounDown init={"Hours"} time={hours} />
          <CounDown init={"Minutes"} time={minutes} />
          <CounDown init={"Seconds"} time={seconds} />
        </div>
        <button
          className="w-full flex gap-2 justify-center items-center bg-main py-2 text-white font-light hover:bg-[#333] transition-all"
          type=""
        >
          <HiOutlineMenu />
          OPTIONS
        </button>
      </div>
    </div>
  );
};

export default memo(DealDaily);
