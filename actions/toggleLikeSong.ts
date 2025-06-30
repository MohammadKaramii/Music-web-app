import { supabase } from "@/supabase";

interface ToggleLikeResult {
  success: boolean;
  isLiked: boolean;
  error?: string;
}

const toggleLikeSong = async (songId: string): Promise<ToggleLikeResult> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        isLiked: false,
        error: "User not authenticated",
      };
    }

    const userId = session.user.id;


    const { data: existingLikes, error: checkError } = await supabase
      .from("liked_songs")
      .select("id")
      .eq("userId", userId)
      .eq("songId", songId);

    if (checkError) {
      throw checkError;
    }

    if (existingLikes && existingLikes.length > 0) {

      const { error: deleteError } = await supabase
        .from("liked_songs")
        .delete()
        .eq("userId", userId)
        .eq("songId", songId);

      if (deleteError) throw deleteError;

      return {
        success: true,
        isLiked: false,
      };
    } else {

      const { error: insertError } = await supabase.from("liked_songs").insert({
        userId,
        songId,
      });

      if (insertError) throw insertError;

      return {
        success: true,
        isLiked: true,
      };
    }
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return {
      success: false,
      isLiked: false,
      error: error.message || "Failed to toggle like",
    };
  }
};

export default toggleLikeSong;
