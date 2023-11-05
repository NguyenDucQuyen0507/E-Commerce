import React, { memo } from "react";
import clsx from "clsx";
const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidateField,
  setInvalidateField,
  placeholder,
  style,
  fullWith,
  isHideLabel,
}) => {
  return (
    <div className={clsx("relative flex flex-col", fullWith && "w-full")}>
      {/* nếu input mà khác rỗng nghĩa là đã có chữ thì mới hiện nó lên */}
      {/*isHideLabel dùng để kt kết hợp với value không cho nameKey nhảy lên   */}
      {!isHideLabel && value?.trim() !== "" && (
        <label
          className="text-[12px] animate-slide-top-input absolute top-[-9px] left-[8px] bg-white px-1"
          htmlFor={nameKey}
        >
          {nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
        </label>
      )}
      <input
        type={type || "text"}
        className={clsx(
          "outline-none p-3 placeholder:text-sm border rounded-[10px] placeholder:italic",
          style
        )}
        placeholder={
          placeholder || nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)
        }
        //tách chữ đầu tiên rồi viết hoa nó lên sau đó cộng với các phần tử còn lại.
        //Vd 'quyền' => 'Q' + 'uyền'
        value={value}
        onChange={(e) =>
          //nameKey ở đây là giá trị được truyền vào từ prop, nameKey phải trùng với tên của value để nó thay đổi chính nó
          setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
        }
        onFocus={() => setInvalidateField && setInvalidateField([])}
      />
      {invalidateField?.some((el) => el.name === nameKey) && (
        <small className="text-main text-[12px] italic">
          {invalidateField?.find((el) => el.name === nameKey)?.mes}
        </small>
      )}
    </div>
  );
};

export default memo(InputField);
