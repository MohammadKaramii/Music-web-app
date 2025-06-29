"use client";
import getSongsbyUserID from "@/actions/getSongsbyUserId";
import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import { useCallback, useEffect, useState } from "react";
import { Song } from "@/types";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { useSongCache, isCacheValid } from "@/providers/SongCacheProvider";

const UserSongs = () => {
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const { id } = useUser();
  const authModal = useAuthModal();
  const { cachedSongs, setCachedUserSongs } = useSongCache();

  const fetchUserSongs = useCallback(async () => {
    try {
      if (!id) return;

      if (
        cachedSongs.userSongs.data &&
        isCacheValid(cachedSongs.userSongs.timestamp)
      ) {
        
        setUserSongs(cachedSongs.userSongs.data);
        return;
      }

      const songs = await getSongsbyUserID();
      setUserSongs(songs);

      setCachedUserSongs(songs);
    } catch (error: any) {
      console.error("Error fetching songs:", error.message);
    }
  }, [id, cachedSongs.userSongs, setCachedUserSongs]);

  useEffect(() => {
    fetchUserSongs();
  }, [fetchUserSongs]);

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
              <h1 className="text-6xl text-white sm:text-5xl lg:text-4xl font-bold">
                Your Added Songs
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
          to see your added songs or{" "}
          <button onClick={() => openAuthModal(true)} className="text-white">
            Signup
          </button>{" "}
          if you don&apos;t have an account
        </div>
      ) : (
        <SongContent songs={userSongs} />
      )}
    </div>
  );
};

export default UserSongs;
