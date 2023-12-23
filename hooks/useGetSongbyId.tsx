import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { Song } from "@/types";
import { getSongbyId } from "@/services/songServices";

const useGetSongbyId = (id?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSong = async () => {
      setIsLoading(true);

      try {
        const response = await getSongbyId(id);
        setSong(response.data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  return useMemo(() => ({ isLoading, song }), [isLoading, song]);
};

export default useGetSongbyId;
