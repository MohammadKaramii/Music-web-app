"use client";
import ArtistContent from "@/components/ArtistContent";
import Header from "@/components/Header";
import { ErrorState, GridSkeleton } from "@/components/ui/LoadingStates";
import { useArtists } from "@/lib/queries";

export default function Artists() {
  const { data: artists = [], isLoading, error, refetch } = useArtists();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Artists</h1>
          {artists.length > 0 && (
            <p className="text-neutral-400 text-sm mt-1">
              {artists.length} artist{artists.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        {error ? (
          <ErrorState message="Failed to load artists. Please try again." onRetry={refetch} />
        ) : isLoading ? (
          <GridSkeleton count={12} />
        ) : (
          <ArtistContent artists={artists} />
        )}
      </div>
    </div>
  );
}
