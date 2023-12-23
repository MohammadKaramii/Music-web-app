import { Song } from "@/types";
import usePlayer from "./usePlayer";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();

  const onPlay = (id: number) => {
    player.setId(id);
    player.setIds(songs.map((song) => song.id));
    player.setInitialIds(songs.map((song) => song.id));
  };

  return onPlay;
};

export default useOnPlay;
