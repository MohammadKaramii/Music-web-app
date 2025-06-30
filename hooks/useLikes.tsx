"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useUser from "./useUser";

interface LikesContextType {
  likedSongs: string[];
  isLiked: (songId: string) => boolean;
  toggleLike: (songId: string) => void;
}

const LikesContext = createContext<LikesContextType>({
  likedSongs: [],
  isLiked: () => false,
  toggleLike: () => {},
});

export const LikesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [likedSongs, setLikedSongs] = useState<string[]>([]);

  // Load from localStorage when user changes
  useEffect(() => {
    if (!user?.id) {
      setLikedSongs([]);
      return;
    }

    const stored = localStorage.getItem(`likes-${user.id}`);
    if (stored) {
      try {
        setLikedSongs(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading likes:", error);
        setLikedSongs([]);
      }
    }
  }, [user?.id]);

  // Save to localStorage whenever likes change
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`likes-${user.id}`, JSON.stringify(likedSongs));
    }
  }, [likedSongs, user?.id]);

  const isLiked = (songId: string): boolean => {
    return likedSongs.includes(songId);
  };

  const toggleLike = (songId: string) => {
    if (!user?.id) {
      toast.error("Please sign in to like songs");
      return;
    }

    const isCurrentlyLiked = likedSongs.includes(songId);

    if (isCurrentlyLiked) {
      setLikedSongs((prev) => prev.filter((id) => id !== songId));
      toast.success("Removed from liked songs");
    } else {
      setLikedSongs((prev) => [...prev, songId]);
      toast.success("Added to liked songs");
    }
  };

  return (
    <LikesContext.Provider value={{ likedSongs, isLiked, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
};

const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error("useLikes must be used within LikesProvider");
  }
  return context;
};

export default useLikes;
