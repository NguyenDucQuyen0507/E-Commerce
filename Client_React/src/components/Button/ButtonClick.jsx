import { memo } from "react";
const ButtonClick = ({ children, style, fw, handleClick, type = "button" }) => {
  return (
    <button
      //Nếu có truyền type thì nó sẽ cập nhật type, còn không nó sẽ lấy type là button
      type={type}
      onClick={handleClick}
      className={
        style
          ? style
          : `px-4 py-2 rounded-md text-white bg-main hover:bg-[#333] font-medium mt-5 ${
              fw ? "w-full" : "w-fit"
            }`
      }
    >
      {children}
    </button>
  );
};

export default memo(ButtonClick);
