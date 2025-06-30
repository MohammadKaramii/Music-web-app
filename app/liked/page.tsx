"use client";

import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useLikes from "@/hooks/useLikes";
import { useCallback, useEffect, useState } from "react";
import { Song } from "@/types";
import { BounceLoader } from "react-spinners";
import { supabase } from "@/supabase";

const Liked = () => {
  const { user, isLoading: userLoading } = useUser();
  const authModal = useAuthModal();
  const { likedSongs } = useLikes();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch song details for liked songs
  const fetchLikedSongDetails = useCallback(async () => {
    if (!user?.id || likedSongs.length === 0) {
      setSongs([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("songs")
        .select("id, title, artist, songPath, cover, user_id")
        .in("id", likedSongs);

      if (fetchError) throw fetchError;

      // Sort songs by liked order (most recent first)
      const sortedSongs = (data || []).sort((a, b) => {
        return likedSongs.indexOf(b.id) - likedSongs.indexOf(a.id);
      });

      setSongs(sortedSongs);
    } catch (error: any) {
      console.error("Error fetching liked songs:", error);
      setError(error.message || "Failed to load liked songs");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, likedSongs]);

  // Fetch when liked songs change
  useEffect(() => {
    fetchLikedSongDetails();
  }, [fetchLikedSongDetails]);

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
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1 className="text-6xl text-white sm:text-5xl lg:text-4xl font-bold">
                Liked Songs
              </h1>
              {likedSongs.length > 0 && (
                <p className="text-neutral-400 text-sm">
                  {likedSongs.length} song{likedSongs.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </Header>

      {!user ? (
        <div className="flex flex-col gap-y-2 px-6 py-6 w-full text-xl text-neutral-400">
          <p>You need to be signed in to see your liked songs.</p>
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
          <p>Error loading liked songs: {error}</p>
          <button
            onClick={fetchLikedSongDetails}
            className="text-white hover:underline w-fit"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <BounceLoader color="#B80000" size={40} />
        </div>
      ) : likedSongs.length === 0 ? (
        <div className="flex flex-col px-6 py-6 gap-y-2 w-full text-xl text-neutral-400">
          <p>No liked songs yet.</p>
          <p className="text-sm">Songs you like will appear here.</p>
        </div>
      ) : (
        <SongContent songs={songs} />
      )}
    </div>
  );
};

export default Liked;
