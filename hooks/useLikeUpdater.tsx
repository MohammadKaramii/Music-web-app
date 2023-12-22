import { getLikedSongs } from '@/services/songServices';
import { updateIsLikeSong } from '@/services/songServices';
import { useCallback } from 'react';
const useLikeUpdater = () => {
    const handleLikeUpdate = useCallback((songId: string, isLiked: boolean) => {
        const updatedSongs = likedSongs.map((song) => {
            if (song.id === songId) {
              return { ...song, isLiked };
            }
            return song;
          });
          setLikedSongs(updatedSongs);
        
      updateIsLikeSong(songId, isLiked);
    }, []);
  
    return handleLikeUpdate;
  };
  
  export default useLikeUpdater;