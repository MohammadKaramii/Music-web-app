import { create } from "zustand";

interface PlayerStore {
  ids: number[];
  initialIds: number[];
  activeId?: number;
  volume: number;
  shuffleMode: boolean;
  repeatMode: "off" | "one" | "all";
  setId: (id: number) => void;
  setIds: (ids: number[]) => void;
  setInitialIds: (initialIds: number[]) => void;
  setVolume: (volume: number) => void;
  setShuffleMode: (shuffleMode: boolean) => void;
  setRepeatMode: (repeatMode: "off" | "one" | "all") => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  initialIds: [],
  activeId: undefined,
  volume: 1,
  shuffleMode: false,
  repeatMode: "off",
  setId: (id: number) => set({ activeId: id }),
  setIds: (ids: number[]) => set({ ids }),
  setInitialIds: (initialIds: number[]) => set({ initialIds }),
  setVolume: (volume: number) => set({ volume }),
  setShuffleMode: (shuffleMode: boolean) => set({ shuffleMode }),
  setRepeatMode: (repeatMode: "off" | "one" | "all") => set({ repeatMode }),
  reset: () => set({ ids: [], activeId: undefined }),
}));

export default usePlayer;
