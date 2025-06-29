"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import { Song } from "@/types";
import PageContent from "@/components/PageContent";
import useAuthModal from "@/hooks/useAuthModal";
import { supabase } from "@/supabase";
import Loading from "./loading";
import getSongs from "@/actions/getSongs";
import { useSongCache, isCacheValid } from "@/providers/SongCacheProvider";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const { loggedIn, name } = useAuthModal();
  const [isLoading, setIsLoading] = useState(true);
  const { cachedSongs, setCachedAllSongs } = useSongCache();

  const fetchSongs = useCallback(async () => {
    try {
      if (
        cachedSongs.allSongs.data &&
        isCacheValid(cachedSongs.allSongs.timestamp)
      ) {
        setSongs(cachedSongs.allSongs.data);
        setIsLoading(false);
        return;
      }

      const songs = await getSongs();
      setSongs(songs);

      setCachedAllSongs(songs);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching songs:", error.message);
    }
  }, [
    cachedSongs.allSongs.data,
    cachedSongs.allSongs.timestamp,
    setCachedAllSongs,
  ]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const currentTime = useMemo(() => new Date(), []);
  const hour = useMemo(() => currentTime.getHours(), [currentTime]);

  const partOfDay = useMemo(() => {
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 20) {
      return "Good evening";
    } else {
      return "Good night";
    }
  }, [hour]);

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
        {isLoading ? (
          <div className="mt-[400px]">
            <Loading />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-white font-semibold text-2xl">
                Latest songs
              </h1>
            </div>
            <PageContent songs={songs} />
          </>
        )}
      </div>
    </div>
  );
}
