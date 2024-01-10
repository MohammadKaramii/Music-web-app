"use client";
import Header from "@/components/Header";
import { useCallback, useEffect, useState } from "react";
import { Artist } from "@/types";
import ArtistContent from "@/components/ArtistContent";
import getArtists from "@/actions/getArtists";

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const fetchArtists = useCallback(async () => {
    try {
      const artists = await getArtists();
      setArtists(artists);
    } catch (error: any) {
      console.error("Error fetching artists:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Artists</h1>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <ArtistContent artists={artists} />
      </div>
    </div>
  );
}
