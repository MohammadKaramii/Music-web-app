"use client";
import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/ui/LoadingStates";
import { useSongsByArtist } from "@/lib/queries";
import { useParams } from "next/navigation";

const ArtistSongs = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const decodedArtistName = decodeURIComponent(artistName);
  const { data: artistsSongs = [], isLoading, error, refetch } = useSongsByArtist(decodedArtistName);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col items-center md:flex-row gap-x-5">
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <h1 className="text-6xl text-white sm:text-5xl lg:text-4xl font-bold">{decodedArtistName}</h1>
              {artistsSongs.length > 0 && (
                <p className="text-neutral-400 text-sm">
                  {artistsSongs.length} song
                  {artistsSongs.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
        </div>
      </Header>

      {error ? (
        <div className="px-6">
          <ErrorState message={`Failed to load songs by ${decodedArtistName}. Please try again.`} onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <ListSkeleton count={8} />
      ) : artistsSongs.length === 0 ? (
        <div className="px-6">
          <EmptyState title="No songs found" description={`No songs found by ${decodedArtistName}`} />
        </div>
      ) : (
        <SongContent songs={artistsSongs} />
      )}
    </div>
  );
};

export default ArtistSongs;
