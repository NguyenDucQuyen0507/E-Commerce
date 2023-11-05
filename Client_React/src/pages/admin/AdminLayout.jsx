import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "utils/path";
import { useSelector } from "react-redux";
import { SideBarAdmin } from "components";
//kiểm tra dk trước khi nó return. Nghĩa là nó không chạy zô component
const AdminLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  //Những ai có role là 1 mới zô được trang admin
  if (!isLoggedIn || !current || +current.role !== 1)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  return (
    <div className="w-full flex min-h-screen relative overflow-auto">
      <div className="w-[330px] flex-none fixed top-0 bottom-0">
        <SideBarAdmin />
      </div>
      <div className="w-[330px] flex-none"></div>
      <div className="flex-auto h-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
