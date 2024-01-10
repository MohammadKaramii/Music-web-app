"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { GoPerson } from "react-icons/go";
import Link from "next/link";
import useUploadModal from "@/hooks/useUploadModal";
import useAuthModal from "@/hooks/useAuthModal";
import { RiFolderMusicLine } from "react-icons/ri";
const Library = () => {
  const uploadModal = useUploadModal();
  const authModal = useAuthModal();

  const onClick = () => {
    const { loggedIn } = authModal;
  
    if (loggedIn) {
      uploadModal.onOpen();
    } else {
      authModal.onOpen();
    }
  };

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
          onClick={onClick}
        />
      </div>
      <Link href="/liked" className="">
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
      <Link href="/artists" className="">
        <div className="flex items-center justify-between border-b-2 px-5 py-4 border-gray-500  hover:bg-white/20 transition ">
          <div className="inline-flex items-center gap-x-2 ">
            <GoPerson size={26} className="text-neutral-400" />
            <p className="text-neutral-400 text-md font-medium">Artists</p>
          </div>
          <IoIosArrowForward
            size={20}
            className="text-neutral-400 cursor-pointer  hover:text-white transition"
          />
        </div>
      </Link>    
        <Link href="/yoursongs" className="">
        <div className="flex items-center justify-between border-b-2 px-5 py-4 border-gray-500  hover:bg-white/20 transition ">
          <div className="inline-flex items-center gap-x-2 ">
            <RiFolderMusicLine size={26} className="text-neutral-400" />
            <p className="text-neutral-400 text-md font-medium">Your Added Songs</p>
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
