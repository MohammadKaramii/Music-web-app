import { create } from "zustand";

interface UserStore {
  id: string;
  setId: (id: string) => void;
  isLiked: boolean;
  setIsLiked: (isLiked: boolean) => void;
}

const useUser = create<UserStore>((set) => ({
  id: '',
  setId: (id: string) => set({ id }),
  isLiked: false,
  setIsLiked:(isLiked: boolean) => set({isLiked})
}));

export default useUser;