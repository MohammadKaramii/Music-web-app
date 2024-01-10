import { supabase } from "@/supabase";
import { Song } from '@/types';

const getLikedSongs = async (): Promise<Song[]> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: likedSongs, error: likedSongsError } = await supabase
    .from('liked_songs')
    .select('*')
    .eq('userId', session?.user?.id)
    .order('created_at', { ascending: false });


   
    
  if (likedSongsError) {
    console.log(likedSongsError);
    return [];
  }

  if (!likedSongs) {
    return [];
  }
  
  const songIds = likedSongs.map((likedSong: any) => likedSong.songId);

  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select('*')
    .in('id', songIds);

  if (songsError) {
    console.log(songsError);
    return [];
  }

  if (!songs) {
    return [];
  }

  const likedSongsWithDetails: Song[] = likedSongs.map((likedSong: any) => {
    const song = songs.find((song: any) => song.id === likedSong.songId);
    return  song 
  });

  return likedSongsWithDetails;
};

export default getLikedSongs;