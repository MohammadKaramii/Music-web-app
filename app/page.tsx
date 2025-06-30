"use client";
import React, { useMemo, useEffect } from "react";
import Header from "@/components/Header";
import PageContent from "@/components/PageContent";
import useAuthModal from "@/hooks/useAuthModal";
import { useSongs, usePrefetchQueries } from "@/lib/queries";
import { GridSkeleton, ErrorState } from "@/components/ui/LoadingStates";

export default function Home() {
  const { loggedIn, name } = useAuthModal();
  const { data: songs = [], isLoading, error, refetch } = useSongs();
  const { prefetchArtists } = usePrefetchQueries();

  useEffect(() => {
    prefetchArtists();
  }, [prefetchArtists]);

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
        {error ? (
          <ErrorState
            message="Failed to load songs. Please try again."
            onRetry={refetch}
          />
        ) : isLoading ? (
          <GridSkeleton count={12} />
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
