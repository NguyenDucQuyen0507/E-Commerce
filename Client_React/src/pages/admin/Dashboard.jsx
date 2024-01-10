import withBaseComponent from "hocs/withBaseComponent";
import React from "react";
import path from "utils/path";

const Dasboard = ({ navigate }) => {
  return (
    <div className="bg-gray-200 h-full">
      <p className="text-blue-400 uppercase text-center text-[30px] pt-10">
        Welcome to the administration page. What do you need?
      </p>
      <div className="flex justify-center mt-10 gap-4 items-center">
        <span
          onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_USER}`)}
          className="py-2 px-4 bg-blue-300 rounded-lg cursor-pointer hover:bg-blue-500 text-white"
        >
          Manager user
        </span>
        <span
          onClick={() => navigate(`/${path.ADMIN}/${path.CREATE_PRODUCTS}`)}
          className="py-2 px-4 bg-blue-300 rounded-lg cursor-pointer hover:bg-blue-500 text-white"
        >
          Create products
        </span>
        <span
          onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_PRODUCTS}`)}
          className="py-2 px-4 bg-blue-300 rounded-lg cursor-pointer hover:bg-blue-500 text-white"
        >
          Manager products
        </span>
        <span
          onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_ORDER}`)}
          className="py-2 px-4 bg-blue-300 rounded-lg cursor-pointer hover:bg-blue-500 text-white"
        >
          Manager order
        </span>
      </div>
    </div>
  );
};

export default withBaseComponent(Dasboard);
