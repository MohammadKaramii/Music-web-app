"use client";
import Header from "@/components/Header";
import SongContent from "@/components/SongContent";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { useSongsByUser } from "@/lib/queries";
import {
  FullPageLoading,
  ListSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/ui/LoadingStates";

const UserSongs = () => {
  const { user, isLoading: userLoading } = useUser();
  const authModal = useAuthModal();
  const {
    data: userSongs = [],
    isLoading,
    error,
    refetch,
  } = useSongsByUser(user?.id || "");

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
              <h1 className="text-6xl text-white sm:text-5xl lg:text-4xl font-bold">
                Your Added Songs
              </h1>
              {userSongs.length > 0 && (
                <p className="text-neutral-400 text-sm">
                  {userSongs.length} song{userSongs.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </Header>

      {!user ? (
        <div className="flex flex-col gap-y-2 px-6 py-6 w-full text-xl text-neutral-400">
          <p>You need to be signed in to see your added songs.</p>
          <div className="flex gap-x-2">
            <button
              onClick={() => openAuthModal(false)}
              className="text-white hover:underline"
            >
              Sign In
            </button>
            <span>or</span>
            <button
              onClick={() => openAuthModal(true)}
              className="text-white hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : error ? (
        <div className="px-6">
          <ErrorState
            message="Failed to load your songs. Please try again."
            onRetry={refetch}
          />
        </div>
      ) : isLoading ? (
        <ListSkeleton count={8} />
      ) : userSongs.length === 0 ? (
        <div className="px-6">
          <EmptyState
            title="No songs uploaded yet"
            description="Upload your first song to see it here!"
          />
        </div>
      ) : (
        <SongContent songs={userSongs} />
      )}
    </div>
  );
};

export default UserSongs;
