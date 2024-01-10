import { supabase } from '@/supabase';
import { Song } from '@/types';

const getSongsbyUserID = async (): Promise<Song[]> => {

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', sessionData.session?.user.id)
  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getSongsbyUserID;