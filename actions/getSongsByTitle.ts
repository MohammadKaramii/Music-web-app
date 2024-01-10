
import getSongs from './getSongs';
import { supabase } from '@/supabase';

const getSongsbyTitle = async (title: string) => {
 
  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`)

  if (error) {
    console.log(error);
  }

  return (data as any) || [];
};

export default getSongsbyTitle;
