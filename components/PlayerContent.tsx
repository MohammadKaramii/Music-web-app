import { useEffect, useMemo, useState, useCallback } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import ShuffleButton from "./ShuffleButton";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { TbRepeat, TbRepeatOnce, TbRepeatOff } from "react-icons/tb";
import useDebounce from "@/hooks/useDebounce";
interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const sound = useMemo(() => new Audio(songUrl), [songUrl]);

  const Icon = useMemo(
    () => (isPlaying ? BsPauseFill : BsPlayFill),
    [isPlaying]
  );

  const ValumeIcon = useMemo(
    () => (player.volume === 0 ? HiSpeakerXMark : HiSpeakerWave),
    [player.volume]
  );

  const toggleShuffle = useCallback(() => {
    player.setShuffleMode(!player.shuffleMode);
  }, [player]);
  useMemo(() => {
    if (player.shuffleMode) {
      player.setIds(player.initialIds.slice().sort(() => Math.random() - 0.5));
    } else {
      player.setIds(player.initialIds);
    }
  }, [player.shuffleMode]);

  const toggleRepeat = useCallback(() => {
    if (player.repeatMode === "off") {
      player.setRepeatMode("all");
    } else if (player.repeatMode === "all") {
      player.setRepeatMode("one");
    } else {
      player.setRepeatMode("off");
    }
  }, [player.repeatMode]);

  const onPlayNext = useCallback(() => {
    if (player.ids.length == 0) {
      return;
    }
    const currentSong = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentSong + 1];
    if (!nextSong) {
      return player.setId(player.ids[0]);
    }
    player.setId(nextSong);
  }, [player]);

  const onPlayPrevious = useCallback(() => {
    if (player.ids.length == 0) {
      return;
    }
    const currentSong = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentSong - 1];
    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }
    player.setId(previousSong);
  }, [player]);

  useEffect(() => {
    let interval: any;
    if (sound) {
      sound.volume = player.volume;
      sound.play();
      setDuration(sound.duration);
      const updateCurrentTime = () => {
        const newPosition = Math.floor(sound.currentTime || 0);
        setCurrentTime(newPosition);
      };
      interval = setInterval(() => {
        updateCurrentTime();
      }, 1000);
    }

    return () => {
      if (sound) {
        sound.pause();
        setDuration(0);
      }
      clearInterval(interval);
    };
  }, [sound, player.volume]);

  const handlePlay = useCallback(() => {
    if (!isPlaying) {
      sound.volume = player.volume;
      sound.play();
      setIsPlaying(true);
    } else {
      sound.pause();
      setIsPlaying(false);
    }
  }, [isPlaying, sound, player.volume]);

  const toggleMute = useCallback(() => {
    if (player.volume === 0) {
      player.setVolume(1);
    } else {
      player.setVolume(0);
    }
  }, [player]);
  const formatDuration = (duration: number): string => {
    if (!duration) {
      return `${"--"} : ${"--"}`;
    }

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formattedMinutes} : ${formattedSeconds}`;
  };

  const handleSeek = useCallback(
    (value: number) => {
      const newPosition = Math.floor(sound.duration * value);
      setCurrentTime(newPosition);
      if (sound) {
        sound.currentTime = newPosition;
      }
    },
    [sound, duration]
  );

  const IconRepeat = useMemo(() => {
    if (player.repeatMode === "all") {
      return TbRepeat;
    } else if (player.repeatMode === "one") {
      return TbRepeatOnce;
    } else {
      return TbRepeatOff;
    }
  }, [player.repeatMode]);

  const handleMusicEnded = useCallback(() => {
    if (player.repeatMode === "off") {
      setIsPlaying(false);
    } else if (player.repeatMode === "one") {
      sound.currentTime = 0;
      sound.play();
    } else if (player.repeatMode === "all") {
      onPlayNext();
    }
  }, [player.repeatMode]);

  useEffect(() => {
    sound.addEventListener("play", () => setIsPlaying(true));
    sound.addEventListener("pause", () => setIsPlaying(false));
    sound.addEventListener("ended", handleMusicEnded);

    return () => {
      sound.removeEventListener("play", () => setIsPlaying(true));
      sound.removeEventListener("pause", () => setIsPlaying(false));
      sound.removeEventListener("ended", handleMusicEnded);
    };
  }, [sound, onPlayNext]);

  const handleVolumeChange = useCallback(
    (value: number) => {
      if (sound) {
        sound.volume = value;
        player.setVolume(value);
        setCurrentTime(Math.floor(sound.currentTime));
      }
    },
    [sound, player]
  );

  return (
    <div className="grid grid-cols-3 h-full">
      <div className="flex justify-start w-full">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton song={song} />
        </div>
      </div>
      <div className="md:hidden  pr-7 flex col-span-2 w-full justify-end items-center ">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center p-1 cursor-pointer bg-white justify-center rounded-full mr-1"
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
          <Slider value={player.volume} onChange={handleVolumeChange} />
        </div>
      </div>

      <div className="hidden md:flex w-full  md:justify-start pl-4">
        <ShuffleButton
          shuffleMode={player.shuffleMode}
          toggleShuffle={toggleShuffle}
        />
      </div>

      <div className="flex col-span-3 md:col-span-1 h-full justify-center items-center w-full max-w-[722px] px-3 md:px-0 gap-x-6">
        <div className="flex items-center justify-center w-full  max-w-[722px] gap-x-2">
          <span className="text-white whitespace-nowrap p-2">
            {formatDuration(currentTime)}
          </span>
          <Slider value={currentTime / sound.duration} onChange={handleSeek} />

          <span className="text-white whitespace-nowrap p-2">
            {formatDuration(sound.duration)}
          </span>
        </div>
      </div>
      <div className="flex col-span-2 md:hidden pb-3 w-full md:justify-start pl-5">
        <ShuffleButton
          shuffleMode={player.shuffleMode}
          toggleShuffle={toggleShuffle}
        />
      </div>
      <div className="flex w-full justify-end pb-3 md:pb-0 pr-10 md:pr-2">
        <button onClick={toggleRepeat}>
          {player.repeatMode === "all" || player.repeatMode === "one" ? (
            <IconRepeat color="white" size={23} />
          ) : (
            <IconRepeat color="gray" size={23} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PlayerContent;
