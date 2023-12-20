import Image from 'next/image';

import { Song } from '@/types';

interface MediaItemProps {
  data: Song;

}

const MediaItem: React.FC<MediaItemProps> = ({ data}) => {
 


  return (
    <div
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          src={data.cover}
          fill
          alt="Image"
          className=" object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{data.title}</p>
        <p className=" text-neutral-400 text-sm truncate">{data.artist}</p>
      </div>
    </div>
  );
};

export default MediaItem;
