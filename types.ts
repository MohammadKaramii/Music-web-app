import { IconType } from 'react-icons';

export interface Song {
    id: string;
    artist: string;
    title: string;
    songPath: string;
    cover: string;
    created_at: string
  }

  export interface SidebarItemProps {
    label: string;
    href: string;
    icon: IconType;
    active?: boolean;
    key: string;
  }


