"use client";

import { ButtonLoading } from "@/components/ui/LoadingStates";
import useAuthModal from "@/hooks/useAuthModal";
import useUser from "@/hooks/useUser";
import { useLikeSong, useUserLikes } from "@/lib/queries";
import { Song } from "@/types";
import React from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  song: Song;
  size?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ song, size = 25 }) => {
  const { user } = useUser();
  const { onOpen } = useAuthModal();
  const { data: likedSongIds = [] } = useUserLikes(user?.id || "");
  const likeMutation = useLikeSong();

  const isLiked = likedSongIds.includes(song.id);
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user?.id) {
      return onOpen();
    }

    try {
      await likeMutation.mutateAsync({
        songId: song.id,
        userId: user.id,
        isLiked,
      });
    } catch (error) {
      toast.error(`Failed to like song, ${error}`);
    }
  };

  return (
    <button
      className="cursor-pointer hover:opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleLike}
      disabled={likeMutation.isPending}
      aria-label={isLiked ? "Unlike song" : "Like song"}
    >
      {likeMutation.isPending ? (
        <ButtonLoading size={size * 0.6} color={isLiked ? "#B80000" : "white"} />
      ) : (
        <Icon color={isLiked ? "#B80000" : "white"} size={size} />
      )}
    </button>
  );
};

export default LikeButton;
