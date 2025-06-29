"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import { useParams } from "next/navigation";
import getSongsByArtist from "@/actions/getSongsByArtist";
import { Song } from "@/types";
import { useSongCache, isCacheValid } from "@/providers/SongCacheProvider";

const ArtistSongs = () => {
  const [artistsSongs, setArtistsSongs] = useState<Song[]>([]);
  const { artistName } = useParams<{ artistName: string }>();
  const { cachedSongs, setCachedArtistSongs } = useSongCache();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          cachedSongs.artistSongs[artistName] &&
          cachedSongs.artistSongs[artistName].data &&
          isCacheValid(cachedSongs.artistSongs[artistName].timestamp)
        ) {
          setArtistsSongs(cachedSongs.artistSongs[artistName].data!);
          return;
        }
        const songs = await getSongsByArtist(artistName);
        setArtistsSongs(songs);
        setCachedArtistSongs(artistName, songs);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };

    fetchData();
  }, [artistName, cachedSongs.artistSongs, setCachedArtistSongs]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col items-center md:flex-row gap-x-5">
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <h1 className="text-6xl text-white sm:text-5xl lg:text-4xl font-bold">
                Artist Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <SongContent songs={artistsSongs} />
    </div>
  );
};

export default ArtistSongs;
