import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Song } from "@/types";
import { supabase } from "@/supabase";

const useGetSongbyId = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }
      setSong(data as Song);
      setIsLoading(false);
    };
    fetchSong();
  }, [id]);

  return useMemo(() => ({ isLoading, song }), [isLoading, song]);
};

export default useGetSongbyId;
