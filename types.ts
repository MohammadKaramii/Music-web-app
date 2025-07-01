import { IconType } from "react-icons";

export interface Song {
  id: string;
  artist: string;
  title: string;
  songPath: string;
  cover: string;
  user_id?: string;
  is_public?: boolean;
}

export interface LikedSong {
  id: string;
  userId: string;
  songId: string;
  created_at: string;
}

export interface SidebarItemProps {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  key: string;
}

export interface Artist {
  name: string;
  picture: string;
  id: string;
}
