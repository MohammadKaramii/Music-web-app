import { Artist } from "@/types";
import ArtistItem from "./ArtistItem";
import Link from "next/link";

interface ArtistContentProps {
  artists: Artist[];
}

const ArtistContent: React.FC<ArtistContentProps> = ({ artists }) => {
  if (artists.length === 0) {
    return <div className="mt-4 text-neutral-400">No artists available</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
      {artists.map((item) => (
        <Link href={`/artists/${item.name}`} key={item.id}>
          <ArtistItem data={item} />
        </Link>
      ))}
    </div>
  );
};

export default ArtistContent;