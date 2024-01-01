import { useEffect, useState } from "react";
import { Song } from "@/types";
import { useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { updateIsLikeSong } from "@/services/songServices";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
interface LikeButtonProps {
  song: Song;
}

const LikeButton: React.FC<LikeButtonProps> = ({ song }) => {
  const router = useRouter();
  const { id } = useUser();

  const authModal = useAuthModal();
  const [isLiked, setIsLiked] = useState(song.isLiked);

  useEffect(() => {
    if (!id) {
      return;
    }
  }, [song.id, id]);

  const handleLike = async () => {
    if (!id) {
      return authModal.onOpen();
    }

    try {
      let updatedLikedBy;
      if (isLiked) {
        updatedLikedBy = song.likedBy.filter((userId) => userId !== id);
      } else {
        updatedLikedBy = [...song.likedBy, id];
      }

      const updatedSong = {
        ...song,
        isLiked: !isLiked,
        likedBy: updatedLikedBy,
      };
      await updateIsLikeSong(song.id, updatedSong);
      console.log(updatedSong);

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
