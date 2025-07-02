import { supabase } from "@/supabase";
import { Song } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const handleSupabaseError = (error: PostgrestError) => {
  console.error("Supabase error:", error);
  throw new Error(error?.message || "An error occurred while fetching data");
};

export const useSongs = (userId?: string) => {
  return useQuery({
    queryKey: userId ? queryKeys.songs.byUser(userId) : queryKeys.songs.all,
    queryFn: async (): Promise<Song[]> => {
      const query = supabase.from("songs").select("*");

      const filteredQuery = userId ? query.or(`is_public.eq.true,user_id.eq.${userId}`) : query.eq("is_public", true);

      const { data, error } = await filteredQuery.order("id", { ascending: false });

      if (error) handleSupabaseError(error);

      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useSongsByArtist = (artistName: string, userId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.songs.byArtist(artistName), userId],
    queryFn: async (): Promise<Song[]> => {
      const query = supabase.from("songs").select("*").ilike("artist", `%${artistName}%`);

      const filteredQuery = userId ? query.or(`is_public.eq.true,user_id.eq.${userId}`) : query.eq("is_public", true);

      const { data, error } = await filteredQuery.order("title", { ascending: true });

      if (error) handleSupabaseError(error);

      return data || [];
    },
    enabled: !!artistName && artistName.length > 0,
    staleTime: 15 * 60 * 1000,
  });
};

export const useSongsByTitle = (title: string, userId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.songs.byTitle(title), userId],
    queryFn: async (): Promise<Song[]> => {
      if (!title || title.length < 2) return [];

      const query = supabase.from("songs").select("*").ilike("title", `%${title}%`);

      const filteredQuery = userId ? query.or(`is_public.eq.true,user_id.eq.${userId}`) : query.eq("is_public", true);

      const { data, error } = await filteredQuery.order("title", { ascending: true }).limit(50);

      if (error) handleSupabaseError(error);

      return data || [];
    },
    enabled: !!title && title.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchSongs = (searchTerm: string, userId?: string) => {
  return useQuery({
    queryKey: ["songs", "search", searchTerm, userId],
    queryFn: async (): Promise<Song[]> => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const query = supabase.from("songs").select("*");

      const withSearchTermQuery = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);

      const filteredQuery = userId
        ? withSearchTermQuery.or(`is_public.eq.true,user_id.eq.${userId}`)
        : withSearchTermQuery.eq("is_public", true);

      const { data, error } = await filteredQuery.order("title", { ascending: true }).limit(50);

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
        .or(`is_public.eq.true,user_id.eq.${userId}`)
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
        `,
        )
        .eq("userId", userId)
        .order("id", { ascending: false });

      if (error) handleSupabaseError(error);

      return data?.map((item: { songs: Song }) => item.songs).filter(Boolean) || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSong = (id: string) => {
  return useQuery({
    queryKey: queryKeys.songs.single(id),
    queryFn: async (): Promise<Song | null> => {
      const { data, error } = await supabase.from("songs").select("*").eq("id", id).single();

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
      const { data, error } = await supabase.from("artists").select("*").order("name", { ascending: true });

      if (error) handleSupabaseError(error);

      return data || [];
    },
    staleTime: 20 * 60 * 1000,
  });
};

export const useLikeSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ songId, userId, isLiked }: { songId: string; userId: string; isLiked: boolean }) => {
      if (isLiked) {
        const { error } = await supabase.from("liked_songs").delete().eq("songId", songId).eq("userId", userId);

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

      const previousLikedSongs = queryClient.getQueryData(queryKeys.songs.liked(userId));
      const previousUserLikes = queryClient.getQueryData(queryKeys.user.likes(userId));

      const songData: Song | null = (() => {
        if (!isLiked) {
          const userSongs = queryClient.getQueryData(queryKeys.songs.byUser(userId)) as Song[] | undefined;

          if (userSongs) {
            const foundInUserSongs = userSongs.find((song) => song.id === songId);

            if (foundInUserSongs) return foundInUserSongs;
          }

          const allSongs = queryClient.getQueryData(queryKeys.songs.all) as Song[] | undefined;
          const foundInAllSongs = allSongs?.find((song) => song.id === songId) || null;

          if (foundInAllSongs) return foundInAllSongs;

          return null;
        }

        return null;
      })();

      queryClient.setQueryData(queryKeys.user.likes(userId), (old: string[] = []) => {
        if (isLiked) {
          return old.filter((id) => id !== songId);
        } else {
          return [...old, songId];
        }
      });

      queryClient.setQueryData(queryKeys.songs.liked(userId), (old: Song[] = []) => {
        if (isLiked) {
          return old.filter((song) => song.id !== songId);
        } else {
          if (songData) {
            return [songData, ...old];
          }

          return old;
        }
      });

      return { previousLikedSongs, previousUserLikes };
    },
    onError: (_err, variables, context) => {
      if (context?.previousLikedSongs) {
        queryClient.setQueryData(queryKeys.songs.liked(variables.userId), context.previousLikedSongs);
      }
      if (context?.previousUserLikes) {
        queryClient.setQueryData(queryKeys.user.likes(variables.userId), context.previousUserLikes);
      }

      toast.error("Failed to update like. Please try again.");
    },
    onSuccess: (data, variables) => {
      toast.success(data.action === "liked" ? "Added to liked songs" : "Removed from liked songs");

      if (data.action === "liked" && data.songData) {
        queryClient.setQueryData(queryKeys.songs.liked(variables.userId), (old: Song[] = []) => {
          const exists = old.some((song) => song.id === data.songId);

          if (!exists) {
            return [data.songData, ...old];
          }

          return old;
        });
      }
    },
    onSettled: (_data, _error, variables) => {
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
      const { data, error } = await supabase.from("liked_songs").select("songId").eq("userId", userId);

      if (error) handleSupabaseError(error);

      return data?.map((item: { songId: string }) => item.songId) || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAllSongs: () => queryClient.invalidateQueries({ queryKey: queryKeys.songs.all }),
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
    prefetchSongs: (userId?: string) =>
      queryClient.prefetchQuery({
        queryKey: userId ? queryKeys.songs.byUser(userId) : queryKeys.songs.all,
        queryFn: async () => {
          const query = supabase.from("songs").select("*");

          const filteredQuery = userId
            ? query.or(`is_public.eq.true,user_id.eq.${userId}`)
            : query.eq("is_public", true);

          const { data, error } = await filteredQuery;

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
