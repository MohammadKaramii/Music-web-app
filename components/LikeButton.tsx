"use client";
import { useEffect, useState } from "react";
import { Song } from "@/types";
import { useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useUser from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { supabase } from "@/supabase";
import { toast } from "react-hot-toast";

interface LikeButtonProps {
  song: Song;
}

const LikeButton: React.FC<LikeButtonProps> = ({ song }) => {
  const router = useRouter();
  const user = useUser();

  const { onOpen } = useAuthModal();
  const [isLiked, setIsLiked] = useState(song.isLiked);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("liked_songs")
        .select("*")
        .eq("userId", user.id)
        .eq("songId", song.id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [song.id, supabase, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user.id) {
      return onOpen();
    }

    if (isLiked) {
      const { error } = await supabase
        .from("liked_songs")
        .delete()
        .eq("userId", user.id)
        .eq("songId", song.id);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabase.from("liked_songs").insert({
        songId: song.id,
        userId: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
      }
    }

    router.refresh();
  };
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
