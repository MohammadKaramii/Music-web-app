import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase";
import { Song } from "@/types";
import toast from "react-hot-toast";

export const queryKeys = {
  songs: {
    all: ["songs"] as const,
    byArtist: (artistName: string) => ["songs", "artist", artistName] as const,
    byTitle: (title: string) => ["songs", "title", title] as const,
    byUser: (userId: string) => ["songs", "user", userId] as const,
    liked: (userId: string) => ["songs", "liked", userId] as const,
    single: (id: string) => ["songs", "single", id] as const,
  },
  artists: {
    all: ["artists"] as const,
    single: (id: string) => ["artists", "single", id] as const,
  },
  user: {
    profile: (id: string) => ["user", "profile", id] as const,
    likes: (id: string) => ["user", "likes", id] as const,
  },
} as const;

const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error);
  throw new Error(error?.message || "An error occurred while fetching data");
};

export const useSongs = () => {
  return useQuery({
    queryKey: queryKeys.songs.all,
    queryFn: async (): Promise<Song[]> => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("id", { ascending: false });

      if (error) handleSupabaseError(error);
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useSongsByArtist = (artistName: string) => {
  return useQuery({
    queryKey: queryKeys.songs.byArtist(artistName),
    queryFn: async (): Promise<Song[]> => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .ilike("artist", `%${artistName}%`)
        .order("title", { ascending: true });

      if (error) handleSupabaseError(error);
      return data || [];
    },
    enabled: !!artistName && artistName.length > 0,
    staleTime: 15 * 60 * 1000,
  });
};

export const useSongsByTitle = (title: string) => {
  return useQuery({
    queryKey: queryKeys.songs.byTitle(title),
    queryFn: async (): Promise<Song[]> => {
      if (!title || title.length < 2) return [];

      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .ilike("title", `%${title}%`)
        .order("title", { ascending: true })
        .limit(50);

      if (error) handleSupabaseError(error);
      return data || [];
    },
    enabled: !!title && title.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchSongs = (searchTerm: string) => {
  return useQuery({
    queryKey: ["songs", "search", searchTerm],
    queryFn: async (): Promise<Song[]> => {
      if (!searchTerm || searchTerm.length < 2) return [];

      // Search by both title and artist using OR condition
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`)
        .order("title", { ascending: true })
        .limit(50);

      if (error) handleSupabaseError(error);
      return data || [];
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSongsByUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.songs.byUser(userId),
    queryFn: async (): Promise<Song[]> => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("user_id", userId)
        .order("title", { ascending: true });

      if (error) handleSupabaseError(error);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useLikedSongs = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.songs.liked(userId),
    queryFn: async (): Promise<Song[]> => {
      const { data, error } = await supabase
        .from("liked_songs")
        .select(
          `
          *,
          songs (*)
        `
        )
        .eq("userId", userId)
        .order("id", { ascending: false });

      if (error) handleSupabaseError(error);
      return data?.map((item: any) => item.songs).filter(Boolean) || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSong = (id: string) => {
  return useQuery({
    queryKey: queryKeys.songs.single(id),
    queryFn: async (): Promise<Song | null> => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) handleSupabaseError(error);
      return data || null;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};

export const useArtists = () => {
  return useQuery({
    queryKey: queryKeys.artists.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("name", { ascending: true });

      if (error) handleSupabaseError(error);
      return data || [];
    },
    staleTime: 20 * 60 * 1000,
  });
};

export const useLikeSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      songId,
      userId,
      isLiked,
    }: {
      songId: string;
      userId: string;
      isLiked: boolean;
    }) => {
      if (isLiked) {
        const { error } = await supabase
          .from("liked_songs")
          .delete()
          .eq("songId", songId)
          .eq("userId", userId);

        if (error) handleSupabaseError(error);
        return { isLiked: false, action: "unliked", songId };
      } else {
        const [likeResult, songResult] = await Promise.all([
          supabase.from("liked_songs").insert({ songId, userId }),
          supabase.from("songs").select("*").eq("id", songId).single(),
        ]);

        if (likeResult.error) handleSupabaseError(likeResult.error);
        if (songResult.error) handleSupabaseError(songResult.error);

        return {
          isLiked: true,
          action: "liked",
          songId,
          songData: songResult.data,
        };
      }
    },
    onMutate: async ({ songId, userId, isLiked }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.songs.liked(userId) }),
        queryClient.cancelQueries({ queryKey: queryKeys.user.likes(userId) }),
      ]);

      const previousLikedSongs = queryClient.getQueryData(
        queryKeys.songs.liked(userId)
      );
      const previousUserLikes = queryClient.getQueryData(
        queryKeys.user.likes(userId)
      );

      let songData: Song | null = null;
      if (!isLiked) {
        const allSongs = queryClient.getQueryData(queryKeys.songs.all) as
          | Song[]
          | undefined;
        songData = allSongs?.find((song) => song.id === songId) || null;

        if (!songData) {
          try {
            const { data } = await supabase
              .from("songs")
              .select("*")
              .eq("id", songId)
              .single();
            songData = data;
          } catch (error) {
            console.warn(
              "Failed to fetch song data for optimistic update:",
              error
            );
          }
        }
      }

      queryClient.setQueryData(
        queryKeys.user.likes(userId),
        (old: string[] = []) => {
          if (isLiked) {
            return old.filter((id) => id !== songId);
          } else {
            return [...old, songId];
          }
        }
      );

      queryClient.setQueryData(
        queryKeys.songs.liked(userId),
        (old: Song[] = []) => {
          if (isLiked) {
            return old.filter((song) => song.id !== songId);
          } else {
            if (songData) {
              return [songData, ...old];
            }
            return old;
          }
        }
      );

      return { previousLikedSongs, previousUserLikes };
    },
    onError: (err, variables, context) => {
      if (context?.previousLikedSongs) {
        queryClient.setQueryData(
          queryKeys.songs.liked(variables.userId),
          context.previousLikedSongs
        );
      }
      if (context?.previousUserLikes) {
        queryClient.setQueryData(
          queryKeys.user.likes(variables.userId),
          context.previousUserLikes
        );
      }

      toast.error("Failed to update like. Please try again.");
    },
    onSuccess: (data, variables) => {
      toast.success(
        data.action === "liked"
          ? "Added to liked songs"
          : "Removed from liked songs"
      );
    },
    onSettled: (data, error, variables) => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.songs.liked(variables.userId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.likes(variables.userId),
        }),
      ]);

      setTimeout(() => {
        queryClient.refetchQueries({
          queryKey: queryKeys.songs.liked(variables.userId),
          type: "active",
        });
      }, 100);
    },
  });
};

export const useUserLikes = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.likes(userId),
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("liked_songs")
        .select("songId")
        .eq("userId", userId);

      if (error) handleSupabaseError(error);
      return data?.map((item: any) => item.songId) || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAllSongs: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.songs.all }),
    invalidateArtistSongs: (artistName: string) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.songs.byArtist(artistName),
      }),
    invalidateUserSongs: (userId: string) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.songs.byUser(userId),
      }),
    invalidateLikedSongs: (userId: string) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.songs.liked(userId),
      }),
    invalidateAll: () => queryClient.invalidateQueries(),
    clearCache: () => queryClient.clear(),
  };
};

export const usePrefetchQueries = () => {
  const queryClient = useQueryClient();

  return {
    prefetchSongs: () =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.songs.all,
        queryFn: async () => {
          const { data, error } = await supabase.from("songs").select("*");
          if (error) handleSupabaseError(error);
          return data || [];
        },
      }),
    prefetchArtists: () =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.artists.all,
        queryFn: async () => {
          const { data, error } = await supabase.from("artists").select("*");
          if (error) handleSupabaseError(error);
          return data || [];
        },
      }),
  };
};
