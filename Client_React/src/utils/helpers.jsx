import { AiFillStar, AiOutlineStar } from "react-icons/ai";
//Dùng để convert sang chữ thường và có dấu _
export const converSlug = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("_");

//render ra số sao
export const renderStarNumber = (number) => {
  if (!Number(number)) return;
  const stars = [];
  //làm tròn từ 3.5 -> 3
  number = Math.round(number);
  //khi nhập vào 1 con số cụ thể thì vòng for thứ nhất sẽ push vào mảng sao đầy
  for (let i = 0; i < +number; i++) stars.push(<AiFillStar color="orange" />);
  //for thứ 2 là nó sẽ đẩy ngôi sao rống còn lại.
  for (let i = 5; i > +number; i--)
    stars.push(<AiOutlineStar color="orange" />);
  return stars;
  //Nghĩa là khi ta nhập vào số 3. thì vòng 1 sẽ là [1,1,1,,]
  //for 2 nó sẽ là [1,1,1,0,0] nó sẽ push 2 ngôi sao rỗng vào
};

export const secondsToHms = (d) => {
  //chia 1000 là chuyển miligiay thành giây
  d = Number(d) / 1000;
  //muốn tính giờ là phải chia cho số s trong 1 h, lấy phần nguyên
  const h = Math.floor(d / 3600);
  //muốn tính phút là lấy phần dư của số s chia cho số s trong 1 phút
  const m = Math.floor((d % 3600) / 60);
  //muốn tính s là phần dư của số s chia cho phần dư của số s trong 1 phút
  const s = Math.floor((d % 3600) % 60);
  return { h, m, s };
};

export const validate = (payload, setInvalidateField) => {
  //nếu như là 0 thì tất cả các filed có giá đúng
  let invalidate = 0;
  //chuyển đổi các object về dạng array => ['email', '']
  const formatPayload = Object.entries(payload);
  //duyệt qua tất cả vòng lặp
  for (let arr of formatPayload) {
    //kiểm tra giá trị value có rống hay không ["email": " "] trong đó email là array[0], '' là array[1] ta sẽ kt giá trị thứ 2 là index =1
    if (arr[1].trim() === "") {
      invalidate++;
      setInvalidateField((prev) => [
        //giữ lại giá trị củ
        //đặt tên cho từng field
        ...prev,
        { name: arr[0], mes: "Required this field" },
      ]);
    }
  }
  //lặp qua lần nữa để bắt value
  // for (let arr of formatPayload) {
  //   switch (arr[0]) {
  //     case "email":
  //       const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  //       if (!arr[1].match(emailRegex)) {
  //         // invalidate++;
  //         setInvalidateField((prev) => [
  //           ...prev,
  //           { name: arr[0], mes: "Email invalid" },
  //         ]);
  //       }
  //       break;
  //     case "password":
  //       if (arr[1].length < 6) {
  //         // invalidate++;
  //         setInvalidateField((prev) => [
  //           ...prev,
  //           { name: arr[0], mes: "Password minimum 6 characters!" },
  //         ]);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // console.log(formatPayload);
  return invalidate;
};
//render ra array sau khi tính toán để phân số trang.
export const generateRange = (start, end) => {
  //khi nhập vào 3 và 6 thì nó sẽ render là [3,4,5,6]
  //nhưng khi tính length bằng end - start = 3 thì mảng sẽ dư ra 1 phần tử
  //nên ta sẽ lấy end + 1 để đúng với length
  const length = end + 1 - start;
  return Array.from({ length }, (_, index) => start + index);
  //nó sẽ return ra theo start sau khi tính toán và truyền vào.
  // cộng với chỉ só index là 0,1,2,3,..., khi start là 3 thì sẽ render là [3,4,5,6]
};

//Xử lý xem ảnh trước bằng base64
export function getBase64(file) {
  if (!file) return "";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
