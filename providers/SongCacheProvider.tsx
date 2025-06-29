"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Song } from "@/types";

interface CachedSongsState {
  allSongs: {
    data: Song[] | null;
    timestamp: number | null;
  };
  artistSongs: {
    [artistName: string]: {
      data: Song[] | null;
      timestamp: number | null;
    };
  };
  userSongs: {
    data: Song[] | null;
    timestamp: number | null;
  };
  likedSongs: {
    data: Song[] | null;
    timestamp: number | null;
  };
}

type SongCacheContextType = {
  cachedSongs: CachedSongsState;
  setCachedAllSongs: (songs: Song[]) => void;
  setCachedArtistSongs: (artistName: string, songs: Song[]) => void;
  setCachedUserSongs: (songs: Song[]) => void;
  setCachedLikedSongs: (songs: Song[]) => void;
  clearCache: () => void;
};

const CACHE_EXPIRY_TIME = 5 * 60 * 1000;

const SongCacheContext = createContext<SongCacheContextType | undefined>(
  undefined
);

interface SongCacheProviderProps {
  children: ReactNode;
}

export const SongCacheProvider = ({ children }: SongCacheProviderProps) => {
  const [cachedSongs, setCachedSongs] = useState<CachedSongsState>({
    allSongs: {
      data: null,
      timestamp: null,
    },
    artistSongs: {},
    userSongs: {
      data: null,
      timestamp: null,
    },
    likedSongs: {
      data: null,
      timestamp: null,
    },
  });

  const setCachedAllSongs = useCallback((songs: Song[]) => {
    setCachedSongs((prev: CachedSongsState) => ({
      ...prev,
      allSongs: {
        data: songs,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const setCachedArtistSongs = useCallback(
    (artistName: string, songs: Song[]) => {
      setCachedSongs((prev: CachedSongsState) => ({
        ...prev,
        artistSongs: {
          ...prev.artistSongs,
          [artistName]: {
            data: songs,
            timestamp: Date.now(),
          },
        },
      }));
    },
    []
  );

  const setCachedUserSongs = useCallback((songs: Song[]) => {
    setCachedSongs((prev: CachedSongsState) => ({
      ...prev,
      userSongs: {
        data: songs,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const setCachedLikedSongs = useCallback((songs: Song[]) => {
    setCachedSongs((prev: CachedSongsState) => ({
      ...prev,
      likedSongs: {
        data: songs,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCachedSongs({
      allSongs: {
        data: null,
        timestamp: null,
      },
      artistSongs: {},
      userSongs: {
        data: null,
        timestamp: null,
      },
      likedSongs: {
        data: null,
        timestamp: null,
      },
    });
  }, []);

  return (
    <SongCacheContext.Provider
      value={{
        cachedSongs,
        setCachedAllSongs,
        setCachedArtistSongs,
        setCachedUserSongs,
        setCachedLikedSongs,
        clearCache,
      }}
    >
      {children}
    </SongCacheContext.Provider>
  );
};

export const useSongCache = () => {
  const context = useContext(SongCacheContext);

  if (context === undefined) {
    throw new Error("useSongCache must be used within a SongCacheProvider");
  }

  return context;
};

export const isCacheValid = (timestamp: number | null) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_EXPIRY_TIME;
};
