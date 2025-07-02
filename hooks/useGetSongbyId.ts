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
      const baseQuery = supabase.from("songs").select("*").eq("id", id);
      const query = userId ? baseQuery.or(`is_public.eq.true,user_id.eq.${userId}`) : baseQuery.eq("is_public", true);

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
