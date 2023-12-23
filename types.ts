import { IconType } from 'react-icons';

export interface Song {
    id: number;
    artist: string;
    title: string;
    songPath: string;
    cover: string;
    isLiked: boolean;
  }

  export interface SidebarItemProps {
    label: string;
    href: string;
    icon: IconType;
    active?: boolean;
    key: string;
  }


