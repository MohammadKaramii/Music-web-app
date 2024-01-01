"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import { getLikedSongs } from "@/services/songServices";
import useUser from "@/hooks/useUser";

import useAuthModal from "@/hooks/useAuthModal";
import { Song } from "@/types";

const Liked = () => {
  const { id } = useUser();
  const authModal = useAuthModal();
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const response = await getLikedSongs();
        const likedSongsByUser = response.data.filter((song: Song) =>
          song.likedBy.includes(id)
        );

        setLikedSongs(likedSongsByUser);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };

    fetchLikedSongs();
  }, [id]);

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
          </button>
          &nbsp;to see liked songs or&nbsp;
          <button onClick={() => openAuthModal(true)} className="text-white">
            Signup
          </button>
          &nbsp;if you don't have an account
        </div>
      ) : (
        <SongContent songs={likedSongs} />
      )}
    </div>
  );
};

export default Liked;
