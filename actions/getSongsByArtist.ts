import { supabase } from "@/supabase";

const getSongsByArtist = async (params: string) => {
  const artistName = decodeURIComponent(params);

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("artist", artistName);

  if (error) {
    throw new Error("Failed to fetch songs");
  }

  return data;
};

export default getSongsByArtist;
