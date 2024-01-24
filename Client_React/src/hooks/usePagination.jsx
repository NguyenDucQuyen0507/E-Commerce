import { useMemo } from "react";
import { generateRange } from "../utils/helpers";
import { BsThreeDots } from "react-icons/bs";
const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = +process.env.REACT_APP_LIMIT || 10;
    const paginationCount = Math.ceil(totalProductCount / pageSize);
    //paginationCount là số dùng để hiển thị ra sau khi tính 66/10 =>7
    const totalPaginationItem = siblingCount + 5;
    //totalPagiantionItem là chỉ hiện thị đúng 6 số [1,2,3,4,5,6], nếu sibling là 1
    if (paginationCount <= totalPaginationItem) {
      //nếu như sau khi tính toán sl sp mà nhỏ hon hoạc bằng 6 thì nó sẽ return ra là [1,2,3,4,5,6]
      return generateRange(1, paginationCount);
    }
    //hiển thị dấu ... ở bên trái [1,...,6,7,8,9,10]
    //Nếu ta nhập (66,7) nghĩa là có 66sp và ta đang ở trang thứ 7
    const isShowLeft = currentPage - siblingCount > 2; //7-1 > T
    const isShowRight = currentPage + siblingCount < paginationCount - 1; //7+1 < 7 F
    if (isShowLeft && !isShowRight) {
      //[1,...,6,7,8,9,10]
      const rightStart = paginationCount - 4; //7-4=3
      const rightRange = generateRange(rightStart, paginationCount); //[3,4,5,6,7]
      return [1, <BsThreeDots />, ...rightRange]; //[1,"DOTS",3,4,5,6,7]
    }
    if (!isShowLeft && isShowRight) {
      //[1,2,3,4,5,...,10]
      //nếu nhập (66,2)
      const leftRange = generateRange(1, 5);
      return [...leftRange, <BsThreeDots />, paginationCount];
    }
    //[1,...,5,6,7,...,10]
    //Nếu nhập là (98,6) 6 thì đều thỏa mãn dk isShowLeft và isShowRight
    const siblingLeft = Math.max(currentPage - siblingCount, 1);
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount);
    if (isShowLeft && isShowRight) {
      const middleRange = generateRange(siblingLeft, siblingRight);
      return [
        1,
        <BsThreeDots />,
        ...middleRange,
        <BsThreeDots />,
        paginationCount,
      ];
    }
  }, [totalProductCount, currentPage, siblingCount]);
  return paginationArray;
};

export default usePagination;

//first + last + current + sibling + dots(dấu ...)
//min = 6 => sibling + 5 (chỉ hiện thị đúng 6 số [1,2,3,4,5,6]), nếu sibling là 1
//totalProductCount: 66 (tổng số sp), limitProduct = 10(số lượng sp hiển thị trên một trang) => totalProductCount sẽ là 7(66/10 = 6.6), phân trang là ta sẽ lấy giới hạn trên là 7
//totalpaginationItem: sibling + 5 ()
//nếu totalProductCount là 6 thì nó sẽ hiển thị là
//[1,2,3,4,5,6]
//nếu nó là 10 thì
//[1,...,6,7,8,9,10]
//[1,2,3,4,5,...,10]
//[1,...,5,6,7,...,10]

//B1 tham số đầu tiên là tổng số lượng sp mình truyền vào để nó phân số trang [1,2,3,4,5,6], thứ 2 là: trang hiện tại đang hiển thị, thứ 3 là: số trang bên cạnh trang hiện tại [1,2,3,4,5] trang hiện tại là số 3
//B2 sử dụng useMemo để tăng performent nó sẽ lưu kết quả của hàm đó,còn useCallback sẽ lưu cả hàm.
//B3 ta sẽ tạo một hàm dùng để render ra kq là [1,2,3,4] trong helper
