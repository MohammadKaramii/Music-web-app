"use client";
import Header from "@/components/Header";
import PageContent from "@/components/PageContent";
import { ErrorState, GridSkeleton } from "@/components/ui/LoadingStates";
import useAuthModal from "@/hooks/useAuthModal";
import useUser from "@/hooks/useUser";
import { usePrefetchQueries, useSongs } from "@/lib/queries";
import React, { useEffect, useMemo } from "react";

export default function Home() {
  const { loggedIn, name } = useAuthModal();
  const { user } = useUser();
  const { data: songs = [], isLoading, error, refetch } = useSongs(user?.id);
  const { prefetchArtists, prefetchSongs } = usePrefetchQueries();

  useEffect(() => {
    prefetchArtists();
    if (user?.id) {
      prefetchSongs(user.id);
    }
  }, [prefetchArtists, prefetchSongs, user?.id]);

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
          <h1 className="text-white text-3xl font-semibold">{loggedIn ? `Hi ${name} !` : partOfDay}</h1>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        {error ? (
          <ErrorState message="Failed to load songs. Please try again." onRetry={refetch} />
        ) : isLoading ? (
          <GridSkeleton count={12} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-white font-semibold text-2xl">
                {user ? "Your uploaded songs" : "Please login to see your songs"}
              </h1>
            </div>
            {user ? (
              songs.length > 0 ? (
                <PageContent songs={songs} />
              ) : (
                <div className="text-neutral-400 mt-4">
                  You haven't uploaded any songs yet. Use the upload button to add songs.
                </div>
              )
            ) : (
              <div className="text-neutral-400 mt-4">Login to see and manage your uploaded songs.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
