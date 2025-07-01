"use client";
import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import { EmptyState, ErrorState, FullPageLoading, ListSkeleton } from "@/components/ui/LoadingStates";
import useAuthModal from "@/hooks/useAuthModal";
import useUser from "@/hooks/useUser";
import { useSongs } from "@/lib/queries";

const UserSongs = () => {
  const { user, isLoading: userLoading } = useUser();
  const authModal = useAuthModal();
  // Get all songs (public for non-authenticated users, public + own songs for authenticated users)
  const { data: songs = [], isLoading, error, refetch } = useSongs(user?.id);

  const openAuthModal = (signupMode: boolean) => {
    authModal.onOpen();
    if (authModal.setSignupMode) {
      authModal.setSignupMode(signupMode);
    }
  };

  if (userLoading) {
    return <FullPageLoading />;
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col items-center md:flex-row gap-x-5">
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <h1 className="text-6xl text-white sm:text-5xl lg:text-4xl font-bold">Songs Library</h1>
              {songs.length > 0 && (
                <p className="text-neutral-400 text-sm">
                  {songs.length} song{songs.length === 1 ? "" : "s"}
                </p>
              )}
              {user && <p className="text-neutral-400 text-sm">Showing public songs and your uploads</p>}
              {!user && <p className="text-neutral-400 text-sm">Showing public songs only</p>}
            </div>
          </div>
        </div>
      </Header>

      {error ? (
        <div className="px-6">
          <ErrorState message="Failed to load songs. Please try again." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <ListSkeleton count={8} />
      ) : songs.length === 0 ? (
        <div className="px-6">
          <EmptyState
            title="No songs available"
            description={user ? "Upload your first song to see it here!" : "Sign in to upload your songs"}
          />
        </div>
      ) : (
        <SongContent songs={songs} />
      )}

      {!user && (
        <div className="flex flex-col gap-y-2 px-6 py-6 w-full text-xl text-neutral-400">
          <p>Sign in to upload and manage your own songs</p>
          <div className="flex gap-x-2">
            <button onClick={() => openAuthModal(false)} className="text-white hover:underline">
              Sign In
            </button>
            <span>or</span>
            <button onClick={() => openAuthModal(true)} className="text-white hover:underline">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSongs;
