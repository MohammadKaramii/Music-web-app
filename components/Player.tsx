"use client";

import useGetSongbyId from "@/hooks/useGetSongbyId";

import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongbyId(player.activeId);

  const songUrl = song?.songPath;

  if (!song || !songUrl || !player.activeId) {
    return null;
  }
  return (
    <div className="fixed bottom-0  bg-black py-2 h-[150px] px-4 w-full">
      <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
    </div>
  );
};

export default Player;
