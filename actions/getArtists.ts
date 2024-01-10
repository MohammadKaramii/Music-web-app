import { supabase } from "@/supabase";

const getArtists = async () => {
  const { data, error } = await supabase.from("artists").select("*");


  if (error) {
    console.log(error);
  }

  return ( data as any) || [];
};

export default getArtists;
