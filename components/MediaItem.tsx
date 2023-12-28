import Image from "next/image";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";

interface MediaItemProps {
  data: Song;
  onClick?: (id: number) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const player = usePlayer();
  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
    return player.setId(data.id);
  };

  return (
    <div
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
      onClick={handleClick}
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image src={data.cover} fill alt="Image" className=" object-cover" />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{data.title}</p>
        <p className=" text-neutral-400 text-sm truncate">{data.artist}</p>
      </div>
    </div>
  );
};

export default MediaItem;
