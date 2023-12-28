"use client";
import { getAllArtists } from "@/services/songServices";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Artist } from "@/types";
import ArtistContent from "@/components/ArtistContent";

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllArtists();
        setArtists(response.data);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };

    fetchData();
  }, []);

 


  

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
          Artists
          </h1>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        
        <ArtistContent artists={artists} />
      </div>
    </div>
  );
}
