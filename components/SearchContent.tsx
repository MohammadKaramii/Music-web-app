"use client";

import React from "react";
import MediaItem from "./MediaItem";
import LikeButton from "@/components/LikeButton";
import { useSearchSongs } from "@/lib/queries";
import {
  SearchLoading,
  ListSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/LoadingStates";

interface SearchContentProps {
  searchTitle: string;
}

const SearchContent: React.FC<SearchContentProps> = ({ searchTitle }) => {
  const {
    data: songs = [],
    isLoading,
    error,
    refetch,
  } = useSearchSongs(searchTitle || "");

  if (error) {
    return (
      <div className="px-6">
        <ErrorState
          message="Failed to search songs. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <SearchLoading />
        <ListSkeleton count={6} />
      </>
    );
  }

  if (!searchTitle || searchTitle.length < 2) {
    return (
      <div className="px-6">
        <EmptyState
          title="Start typing to search"
          description="Enter at least 2 characters to search for songs by title or artist"
        />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="px-6">
        <EmptyState
          title="No songs found"
          description={`No results found for "${searchTitle}"`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      <div className="text-neutral-400 text-sm mb-2">
        Found {songs.length} result{songs.length !== 1 ? "s" : ""} for &quot;
        {searchTitle}&quot;
      </div>
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem data={song} />
          </div>
          <LikeButton song={song} />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
