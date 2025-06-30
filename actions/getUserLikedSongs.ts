import { supabase } from "@/supabase";

const getUserLikedSongs = async (): Promise<string[]> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return [];
    }

    const { data, error } = await supabase
      .from("liked_songs")
      .select("songId")
      .eq("userId", session.user.id);

    if (error) {
      console.error("Error fetching user liked songs:", error);
      return [];
    }

    return data?.map((item) => item.songId) || [];
  } catch (error) {
    console.error("Error in getUserLikedSongs:", error);
    return [];
  }
};

export default getUserLikedSongs;
