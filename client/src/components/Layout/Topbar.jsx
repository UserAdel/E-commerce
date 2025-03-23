import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5"; 
import { RiTwitterXLine } from "react-icons/ri"; 

const Topbar = () => {
  return (
    <div className="h-10 text-center bg-[#ea2e0e] text-white flex items-center justify-between px-24 py-6  w-full  ">
      <div className="space-x-4  items-center hidden md:flex">
        <a className="hover:text-gray-300" href="#">
          <TbBrandMeta className="w-5 h-5" />
        </a>
        <a className="hover:text-gray-300" href="#">
          <IoLogoInstagram className="w-4 h-4" />
        </a>
        <a className="hover:text-gray-300" href="#">
          <RiTwitterXLine className="w-4 h-4" />
        </a>
      </div>
      <div className="sm:flex-grow leading-5">
        <h4 className="">we ship worldwide - fast and reliable shipping</h4>
      </div>
      <div className=" hover:text-gray-300  hover:underline hidden md:block">
        {" "}
        <a href="tel:01119915593">+(20)1119915593 </a>
      </div>
    </div>
  );
};

export default Topbar;
