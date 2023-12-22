"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "@/components/SearchContent";
import { Song } from "@/types";
import { getAllSongs } from "@/services/songServices";

interface SearchProps {
  searchParams: {
    title: string;
  };
}

const Search: React.FC<SearchProps> = ({ searchParams }: SearchProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredData, setFilteredData] = useState<Song[]>([]);
  const searchQuery = searchParams.title;

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

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(songs);
    } else {
      const filteredSongs = songs.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filteredSongs);
    }
  }, [songs, searchQuery]);

  return (
    <div className="bg-neutral-900  rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-3xl text-white font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={filteredData} />
    </div>
  );
};

export default Search;
