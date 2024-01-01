"use client";
import { getAllSongs } from "@/services/songServices";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Song } from "@/types";
import PageContent from "@/components/PageContent";
import useAuthModal from "@/hooks/useAuthModal";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const { loggedIn, name } = useAuthModal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSongs();
        setSongs(response.data);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };

    fetchData();
  }, []);

  const currentTime = new Date();
  const hour = currentTime.getHours();

  const partOfDay =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
      ? "Good afternoon"
      : hour >= 17 && hour < 20
      ? "Good evening"
      : "Good night";

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            {loggedIn ? `Hi ${name} !` : partOfDay}
          </h1>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-semibold text-2xl">Latest songs</h1>
        </div>
        <PageContent songs={songs} />
      </div>
    </div>
  );
}
