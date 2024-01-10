import { supabase } from "@/supabase";
import { Song } from "@/types";

const getLikedSongs = async (): Promise<Song[]> => {

    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    const { data, error } = await supabase
      .from('liked_songs')
      .select('*, songs(*)')
      .eq('userId', session?.user?.id)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.log(error);
      return [];
    }
    if (!data) {
      return [];
    }
  
    return data.map((item: any) => ({ ...item.songs }));
  };
  
  export default getLikedSongs;
  