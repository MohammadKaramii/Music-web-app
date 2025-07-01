import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  initialIds: string[];
  activeId?: string;
  volume: number;
  shuffleMode: boolean;
  repeatMode: "off" | "one" | "all";
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setInitialIds: (initialIds: string[]) => void;
  setVolume: (volume: number) => void;
  setShuffleMode: (shuffleMode: boolean) => void;
  setRepeatMode: (repeatMode: "off" | "one" | "all") => void;
  reset: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  initialIds: [],
  activeId: undefined,
  volume: 1,
  shuffleMode: false,
  repeatMode: "off",
  isOpen: true,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  setInitialIds: (initialIds: string[]) => set({ initialIds }),
  setVolume: (volume: number) => set({ volume }),
  setShuffleMode: (shuffleMode: boolean) => set({ shuffleMode }),
  setRepeatMode: (repeatMode: "off" | "one" | "all") => set({ repeatMode }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  reset: () => set({ ids: [], activeId: undefined }),
}));

export default usePlayer;
