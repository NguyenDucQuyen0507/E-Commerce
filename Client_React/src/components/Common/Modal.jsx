import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "store/categories/appSlice";
const Modal = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() =>
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
      }
      className="absolute inset-0 bg-overlay z-[150] flex items-center justify-center "
    >
      {children}
    </div>
  );
};

export default memo(Modal);
