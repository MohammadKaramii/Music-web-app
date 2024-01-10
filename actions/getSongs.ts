import { supabase } from "@/supabase";

const getSongs = async () => {
  const { data, error } = await supabase.from("songs").select("*");

  if (error) {
    console.log(error);
  }

  return ( data as any) || [];
};

export default getSongs;
