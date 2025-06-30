import { supabase } from "@/supabase";
import { Song } from "@/types";

const getLikedSongs = async (): Promise<Song[]> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return [];
    }

    // Get liked songs from database
    const { data: likedData, error: likedError } = await supabase
      .from("liked_songs")
      .select("songId")
      .eq("userId", session.user.id);

    if (likedError) {
      console.error("Error fetching liked songs:", likedError);
      return [];
    }

    if (!likedData || likedData.length === 0) {
      return [];
    }

    // Get the actual song data
    const songIds = likedData.map((item) => item.songId);
    const { data: songsData, error: songsError } = await supabase
      .from("songs")
      .select("id, title, artist, songPath, cover, user_id")
      .in("id", songIds);

    if (songsError) {
      console.error("Error fetching songs data:", songsError);
      return [];
    }

    return songsData || [];
  } catch (error) {
    console.error("Error in getLikedSongs:", error);
    return [];
  }
};

export default getLikedSongs;
