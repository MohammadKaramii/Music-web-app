import { useState } from "react";
import axios from "axios";
import { Song } from "@/types";
import { useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { updateIsLikeSong } from "@/services/songServices";

interface LikeButtonProps {
  song: Song;
}

const LikeButton: React.FC<LikeButtonProps> = ({ song }) => {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(song.isLiked);
  const handleLike = async () => {
    try {
      const updatedSong = { ...song, isLiked: !isLiked };
      await updateIsLikeSong(song.id, updatedSong);

      setIsLiked(!isLiked);
      router.refresh();
    } catch (error) {
      console.error("Error liking the song:", error);
    }
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleLike}
    >
      <Icon color={isLiked ? "#B80000" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
