"use client";

import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import getLikedSongs from "@/actions/getLikedSongs";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { useCallback, useEffect, useState } from "react";
import { useSongCache, isCacheValid } from "@/providers/SongCacheProvider";
import { Song } from "@/types";

const Liked = () => {
  const { id } = useUser();
  const authModal = useAuthModal();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const { cachedSongs, setCachedLikedSongs } = useSongCache();

  const fetchLikedSongs = useCallback(async () => {
    try {
      if (!id) return;

      if (
        cachedSongs.likedSongs.data &&
        isCacheValid(cachedSongs.likedSongs.timestamp)
      ) {
        setLikedSongs(cachedSongs.likedSongs.data);
        return;
      }

      const songs = await getLikedSongs();
      setLikedSongs(songs);

      setCachedLikedSongs(songs);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  }, [id, cachedSongs.likedSongs, setCachedLikedSongs]);

  useEffect(() => {
    fetchLikedSongs();
  }, [fetchLikedSongs]);

  const openAuthModal = (signupMode: boolean) => {
    authModal.onOpen();
    authModal.setSignupMode(signupMode);
  };

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col items-center md:flex-row gap-x-5">
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1 className="text-6xl text-white sm:text-5xl lg:text-4xl font-bold">
                Liked Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>
      {!id ? (
        <div className="gap-y-2 flex-col px-6 py-6 w-full text-xl text-neutral-400">
          <button onClick={() => openAuthModal(false)} className="text-white">
            Signin
          </button>{" "}
          to see liked songs or{" "}
          <button onClick={() => openAuthModal(true)} className="text-white">
            Signup
          </button>{" "}
          if you don&apos;t have an account
        </div>
      ) : (
        <SongContent songs={likedSongs} />
      )}
    </div>
  );
};

export default Liked;
