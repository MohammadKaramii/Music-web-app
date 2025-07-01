"use client";
import useGetSongbyId from "@/hooks/useGetSongbyId";
import usePlayer from "@/hooks/usePlayer";
import useUser from "@/hooks/useUser";
import React from "react";
import { IoMdClose } from "react-icons/io";

import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { user } = useUser();
  const { song } = useGetSongbyId(player.activeId, user?.id);
  const songUrl = song?.songPath;

  const handleClose = () => {
    player.onClose(); // Function to close the player (can be called from a close button)
  };

  if (!song || !songUrl || !player.activeId || !player.isOpen) {
    return null;
  }

  return (
    <div className="block">
      <div className="fixed bottom-0 bg-black py-2 h-[140px] px-4 w-full">
        <IoMdClose
          onClick={handleClose}
          className="fixed bg-black  text-neutral-400 hover:text-white cursor-pointer transition ml-auto mr-5 right-0"
          size={24}
        />
        <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
      </div>
    </div>
  );
};

export default Player;
