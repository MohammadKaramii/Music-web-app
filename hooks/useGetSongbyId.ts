import { supabase } from "@/supabase";
import { Song } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const useGetSongbyId = (id?: string, userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    const fetchSong = async () => {
      let query = supabase.from("songs").select("*").eq("id", id);

      // If user is authenticated, they can see their own songs and public songs
      // If not, they can only see public songs
      if (userId) {
        query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
      } else {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query.single();

      if (error) {
        setIsLoading(false);

        return toast.error(error.message);
      }
      setSong(data as Song);
      setIsLoading(false);
    };

    fetchSong();
  }, [id, userId]);

  return useMemo(() => ({ isLoading, song }), [isLoading, song]);
};

export default useGetSongbyId;
