"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

const Library = () => {
  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between border-b-2 border-gray-500 px-5 py-4 ">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />
          <p className="text-neutral-400 text-md font-medium">Add Song</p>
        </div>
        <AiOutlinePlus
          size={20}
          className="text-neutral-400 cursor-pointer  hover:text-white transition"
        />
      </div>
      <Link href="liked" className="">
        <div className="flex items-center justify-between border-b-2 px-5 py-4 border-gray-500  hover:bg-white/20 transition ">
          <div className="inline-flex items-center gap-x-2 ">
            <FiHeart size={26} className="text-neutral-400" />
            <p className="text-neutral-400 text-md font-medium">Liked Song</p>
          </div>
          <IoIosArrowForward
            size={20}
            className="text-neutral-400 cursor-pointer  hover:text-white transition"
          />
        </div>
      </Link>
    </div>
  );
};

export default Library;
