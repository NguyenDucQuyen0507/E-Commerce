import React, { memo, useRef, useEffect, useState } from "react";
import logo from "assets/logo.png";
import { voteOption } from "utils/contants";
import { AiFillStar } from "react-icons/ai";
import { ButtonClick } from "components";
const ModalVoteOption = ({ nameProduct, handleScore }) => {
  const modalRef = useRef();
  const [chosenStar, setChosenStar] = useState(null);
  const [comment, setComment] = useState("");
  useEffect(() => {
    // const element = document.getElementById("quyen");
    modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      id="quyen"
      className="bg-white w-[700px] py-8 px-2 flex items-center justify-center flex-col gap-3 "
    >
      <img src={logo} alt="" />
      <div className="flex items-center gap-2">
        <span className="text-[18px] ">Voting the product:</span>
        <span className=" text-main text-[20px] font-medium">
          {nameProduct}
        </span>
      </div>
      <textarea
        name=""
        id=""
        cols="30"
        rows="3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="placeholder:italic w-full placeholder:text-[13px] text-[15px]"
        placeholder="Type somethings ..."
      ></textarea>
      <div className="">
        <p className="text-center">How do you feel this product?</p>
        <div className="flex items-center gap-4 mt-4 w-full">
          {voteOption.map((el) => (
            <div
              onClick={() => setChosenStar(el.id)}
              key={el}
              className="flex flex-col items-center w-[100px] bg-gray-200 p-2 h-[60px] cursor-pointer hover:bg-gray-300"
            >
              {Number(chosenStar) && chosenStar >= el.id ? (
                <AiFillStar color="orange" />
              ) : (
                <AiFillStar color="gray" />
              )}
              <span>{el.text}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <ButtonClick
            fw
            handleClick={() =>
              handleScore({ comment: comment, score: chosenStar })
            }
          >
            Submit
          </ButtonClick>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalVoteOption);
