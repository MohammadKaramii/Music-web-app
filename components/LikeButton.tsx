"use client";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Song } from "@/types";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useLikes from "@/hooks/useLikes";

interface LikeButtonProps {
  song: Song;
  size?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ song, size = 25 }) => {
  const { user } = useUser();
  const { onOpen } = useAuthModal();
  const { isLiked, toggleLike } = useLikes();

  const liked = isLiked(song.id);
  const Icon = liked ? AiFillHeart : AiOutlineHeart;

  const handleLike = () => {
    if (!user) {
      return onOpen();
    }
    toggleLike(song.id);
  };

  return (
    <button
      className="cursor-pointer hover:opacity-75 transition"
      onClick={handleLike}
      aria-label={liked ? "Unlike song" : "Like song"}
    >
      <Icon color={liked ? "#B80000" : "white"} size={size} />
    </button>
  );
};

export default LikeButton;
