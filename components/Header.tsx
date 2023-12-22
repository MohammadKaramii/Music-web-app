"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b to-[#bc2a8d] from-[#4442df] p-6  rounded-t-lg `,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center  justify-between">
        <div className="hidden md:flex items-center gap-x-2">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-75 transition"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-75 transition"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>

        <div className="flex md:hidden gap-x-2 items-center">
          <button
            className="rounded-full p-2 bg-[#D99DF1] flex items-center justify-center hover:opacity-75 transition"
            onClick={() => {}}
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            className="rounded-full p-2 bg-[#D99DF1] flex items-center justify-center hover:opacity-75 transition"
            onClick={() => {}}
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          <div>
            <Button className="bg-transparent text-neutral-200 font-medium">
              Sign Up
            </Button>
          </div>
          <div>
            <Button className="bg-[#D99DF1] px-6 py-2">Log In</Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
