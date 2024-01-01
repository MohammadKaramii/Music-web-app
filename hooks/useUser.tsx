import { create } from "zustand";

interface UserStore {
  id: string;
  setId: (id: string) => void;
}

const useUser = create<UserStore>((set) => ({
  id: '',
  setId: (id: string) => set({ id }),
}));

export default useUser;