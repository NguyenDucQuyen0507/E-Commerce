import React, { memo } from "react";
import usercomment from "assets/usercoment.png";
import moment from "moment";
import { renderStarNumber } from "utils/helpers";

const Comment = ({ img = usercomment, name, comment, star, updateAt }) => {
  return (
    <div className="flex gap-3">
      <div className="">
        <img
          src={img}
          alt=""
          className="w-[40px] h-[40px] rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-auto">
        <div className="flex justify-between items-center gap-4">
          <h2 className="font-medium">{name ? name : "Unknown"}</h2>
          <span className="italic text-sm">{moment(updateAt)?.fromNow()}</span>
        </div>
        <div className="flex flex-col border-2 border-gray-200 bg-gray-100 p-3">
          <span className="flex items-center gap-3">
            <span className="font-medium">Vote:</span>
            <span className="flex">
              {renderStarNumber(star)?.map((el) => (
                <span key={el}>{el}</span>
              ))}
            </span>
          </span>
          <span className="flex gap-3">
            <span className="font-medium">Comment:</span>
            <span>{comment}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);
