import { useEffect, useState } from 'react';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2';
import useSound from 'use-sound';
import { Song } from '@/types';
import MediaItem from './MediaItem';
import LikeButton from './LikeButton';
import Slider from './Slider';
import usePlayer from '@/hooks/usePlayer';
import { FaShuffle } from 'react-icons/fa6';
import { TbRepeat, TbRepeatOnce, TbRepeatOff } from 'react-icons/tb';

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setisPlaying] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // can be "off", "all", or "single"
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const ValumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    if (repeatMode === 'single') {
      return;
    }

    let nextSong = null;

    if (shuffleMode) {
      const shuffledIds = player.ids.filter((id) => id !== player.activeId);
      nextSong = shuffledIds[Math.floor(Math.random() * shuffledIds.length)];
      if (nextSong === undefined) {
        nextSong = player.ids[0];
      }
    } else {
      const currentSong = player.ids.findIndex((id) => id === player.activeId);
      nextSong = player.ids[currentSong + 1];
      if (!nextSong) {
        if (repeatMode === 'all') {
          nextSong = player.ids[0];
        }
      }
    }

    if (nextSong) {
      player.setId(nextSong);
    }
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    if (repeatMode === 'single') {
      return;
    }

    let previousSong = null;

    if (shuffleMode) {
      const shuffledIds = player.ids.filter((id) => id !== player.activeId);
      previousSong =
        shuffledIds[Math.floor(Math.random() * shuffledIds.length)];
      if (previousSong === undefined) {
        previousSong = player.ids[player.ids.length - 1];
      }
    } else {
      const currentSong = player.ids.findIndex((id) => id === player.activeId);
      previousSong = player.ids[currentSong - 1];
      if (!previousSong) {
        if (repeatMode === 'all') {
          previousSong = player.ids[player.ids.length - 1];
        }
      }
    }

    if (previousSong) {
      player.setId(previousSong);
    }
  };

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setisPlaying(true),
    onend: () => {
      setisPlaying(false);
      onPlayNext();
    },
    onpause: () => setisPlaying(false),
    format: ['mp3'],
  });

  useEffect(() => {
    sound?.play();

    const updateCurrentTime = () => {
      const newPosition = Math.floor(sound?.seek() * 1000 || 0);

      setCurrentTime(newPosition);
    };
    const interval = setInterval(updateCurrentTime, 1000);

    return () => {
      sound?.unload();
      clearInterval(interval);
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      return play();
    } else pause();
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else setVolume(0);
  };

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleSeek = (value: number) => {
    setSeekPosition(value);
    const newPosition = Math.floor((duration / 1000) * value);
    setCurrentTime(newPosition * 1000);
    sound?.seek(newPosition);
  };

  const toggleShuffle = () => {
    setShuffleMode((prevShuffleMode) => !prevShuffleMode);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') {
      setRepeatMode('all');
    } else if (repeatMode === 'all') {
      setRepeatMode('single');
    } else {
      setRepeatMode('off');
    }
  };

  const IconRepeat =
    repeatMode === 'all'
      ? TbRepeat
      : repeatMode === 'single'
      ? TbRepeatOnce
      : TbRepeatOff;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex justify-start w-full">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton song={song} />
        </div>
      </div>
      <div className="md:hidden flex col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center p-1 cursor-pointer bg-white justify-center rounded-full"
        >
          <Icon className="text-black" size={30} />
        </div>
      </div>

      <div className="hidden md:flex h-full justify-center items-center w-full max-w-[722px] gap-x-6">
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={30}
          className="text-neutral-400 hover:text-white cursor-pointer transition"
        />
        <div
          onClick={handlePlay}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="text-neutral-400 hover:text-white cursor-pointer"
        />
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <ValumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
      <div className="flex justify-center items-center col-span-3 w-full pr-2">
        <div className="flex items-center justify-center w-full max-w-[722px] gap-x-2">
          <Slider value={currentTime / duration} onChange={handleSeek} />
          <span className="text-white">{formatDuration(currentTime)}</span>
          <span className="text-white">/</span>
          <span className="text-white">{formatDuration(duration)}</span>
        </div>
      </div>
      <div className="absolute left-0 bottom-0 p-4 ml-3">
        <button onClick={toggleShuffle}>
          <FaShuffle color={shuffleMode ? "white" : "gray"} size={20} />
        </button>
      </div>
      <div className="absolute right-0 bottom-0 p-4 mr-3">
        <button onClick={toggleRepeat}>
          <IconRepeat
            color={
              repeatMode === "all" || repeatMode === "single" ? "white" : "gray"
            }
            size={23}
          />
        </button>
      </div>
    </div>
  );
};

export default PlayerContent;
