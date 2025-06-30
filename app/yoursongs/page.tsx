"use client";
import getSongsbyUserID from "@/actions/getSongsbyUserId";
import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import { useCallback, useEffect, useState } from "react";
import { Song } from "@/types";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { useSongCache, isCacheValid } from "@/providers/SongCacheProvider";
import { BounceLoader } from "react-spinners";

const UserSongs = () => {
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const { user, isLoading: userLoading } = useUser();
  const authModal = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cachedSongs, setCachedUserSongs } = useSongCache();

  const fetchUserSongs = useCallback(async () => {
    if (!user?.id || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (
        cachedSongs.userSongs.data &&
        isCacheValid(cachedSongs.userSongs.timestamp)
      ) {
        setUserSongs(cachedSongs.userSongs.data);
        setIsLoading(false);
        return;
      }

      const songs = await getSongsbyUserID();
      setUserSongs(songs);
      setCachedUserSongs(songs);
    } catch (error: any) {
      console.error("Error fetching songs:", error.message);
      setError(error.message || "Failed to load your songs");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, cachedSongs.userSongs, setCachedUserSongs, isLoading]);

  useEffect(() => {
    if (user?.id) {
      fetchUserSongs();
    } else if (!userLoading && !user) {
      setUserSongs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userLoading, fetchUserSongs]);

  const openAuthModal = (signupMode: boolean) => {
    authModal.onOpen();
    if (authModal.setSignupMode) {
      authModal.setSignupMode(signupMode);
    }
  };

  if (userLoading) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full flex items-center justify-center">
        <BounceLoader color="#B80000" size={40} />
      </div>
    );
  }

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

      {!user ? (
        <div className="flex flex-col gap-y-2 px-6 py-6 w-full text-xl text-neutral-400">
          <p>You need to be signed in to see your added songs.</p>
          <div className="flex gap-x-2">
            <button
              onClick={() => openAuthModal(false)}
              className="text-white hover:underline"
            >
              Sign In
            </button>
            <span>or</span>
            <button
              onClick={() => openAuthModal(true)}
              className="text-white hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col gap-y-2 px-6 py-6 w-full text-xl text-red-400">
          <p>Error loading your songs: {error}</p>
          <button
            onClick={fetchUserSongs}
            className="text-white hover:underline w-fit"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <BounceLoader color="#B80000" size={40} />
        </div>
      ) : (
        <SongContent songs={userSongs} />
      )}
    </div>
  );
};

export default UserSongs;
