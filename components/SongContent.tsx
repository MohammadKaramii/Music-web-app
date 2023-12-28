"use client";

import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import { useState } from "react";

interface LikedContentProps {
  songs: Song[];
}

const SongContent: React.FC<LikedContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  const [likedSongs, setLikedSongs] = useState(songs);

  const handleLikeUpdate = (songId: number, isLiked: boolean) => {
    const updatedSongs = likedSongs.map((song) => {
      if (song.id === songId) {
        return { ...song, isLiked };
      }
      return song;
    });
    setLikedSongs(updatedSongs);
  };

  if (songs.length === 0) {
    return (
      <div className=" flex flex-col px-6  py-6 gap-y-2 w-full text-xl text-neutral-400">
        No liked songs...
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-y-2 w-full p-6">
      {songs.map((item) => (
        <div className="flex items-center gap-x-4  w-full" key={item.id}>
          <div className="flex-1">
            <MediaItem onClick={(id: number) => onPlay(id)} data={item} />
          </div>
          <LikeButton song={item} />
        </div>
      ))}
    </div>
  );
};

export default SongContent;
