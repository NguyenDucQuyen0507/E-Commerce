import React, { memo } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FaMapMarker } from "react-icons/fa";
import { AiFillPhone } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
const Footer = () => {
  return (
    <div className="w-full">
      <div className="h-[103px] bg-main flex items-center justify-center">
        <div className="w-main flex justify-between items-center">
          <div className="flex flex-col flex-1">
            <span className="text-[20px] text-gray-100">
              SIGN UP TO NEWSLETTER
            </span>
            <small className="text-[13px] text-gray-300">
              Subscribe now and receive weekly newsletter
            </small>
          </div>
          <div className="flex-1 flex items-center">
            <input
              type="text"
              placeholder="email address"
              className="p-4 pr-0 w-full rounded-l-full bg-[rgba(255,255,255,.1)] outline-none text-gray-300 placeholder:text-gray-300"
            />
            <div className="h-[56px] w-[56px] bg-[rgba(255,255,255,.1)] flex items-center justify-center text-white rounded-r-full">
              <MdOutlineEmail size={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[307px] bg-[#191919] flex justify-center text-white">
        <div className="w-main flex mt-8">
          <div className="flex-2">
            <h2 className="font-medium mb-8 border-l-main border-l-4 pl-5">
              ABOUT US
            </h2>
            <span className="flex flex-col">
              <span className="flex items-center gap-2">
                <span className="font-normal text-[14px] text-white flex items-center gap-2">
                  <FaMapMarker />
                  Address:
                </span>
                <span className="opacity-[0.5] text-[13px]">
                  474 Ontario St Toronto, ON M4X 1M7 Canada
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-normal text-[14px] text-white flex items-center gap-2">
                  <AiFillPhone />
                  Phone:
                </span>
                <span className="opacity-[0.5] text-[13px]">0398232567</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-normal text-[14px] text-white flex items-center gap-2">
                  <HiOutlineMail />
                  Mail:
                </span>
                <span className="opacity-[0.5] text-[13px]">
                  tadathemes@gmail.com
                </span>
              </span>
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-medium mb-8 border-l-main border-l-4 pl-5">
              INFORMATION
            </h2>
            <div className="flex flex-col opacity-[0.5] text-[13px] gap-2">
              <span>Typography</span>
              <span>Gallery</span>
              <span>Store Location</span>
              <span>Today's Deals</span>
              <span>Contact</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-medium mb-8 border-l-main border-l-4 pl-5">
              WHO WE ARE
            </h2>
            <div className="flex flex-col opacity-[0.5] text-[13px] gap-2">
              <span>Help</span>
              <span>Free Shipping</span>
              <span>FAQs</span>
              <span>Return & Exchange</span>
              <span>Testimonials</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-medium mb-8 border-l-main border-l-4 pl-5">
              #DIGITALWORLDSTORE
            </h2>
          </div>
        </div>
      </div>
      <div className="h-[70px] bg-[#0f0f0f] flex justify-center items-center">
        <div className="w-main">
          <span className="opacity-[0.5] text-[15px] text-gray-400">
            © 2023, Digital World 2 Powered by Shopify
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
