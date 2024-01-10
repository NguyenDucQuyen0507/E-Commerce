import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import path from "utils/path";
import { SideBarMember } from "components";
const MemberLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  //kiểm tra dk trước khi nó return. Nghĩa là nó không chạy zô component
  if (!isLoggedIn || !current) {
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  }
  return (
    <div className="flex min-h-screen w-full ">
      <div className="w-[330px] flex-none ">
        <SideBarMember />
      </div>
      <div className="flex-auto bg-gray-100 min-h-screen overflow-hidden ">
        <Outlet />
      </div>
    </div>
  );
};

export default MemberLayout;
