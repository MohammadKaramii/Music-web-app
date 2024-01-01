import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  loggedIn: boolean;
  signupMode: boolean;
  name: string;
 setName: (name: string) => void;
  setSignupMode: (signupMode: boolean) => void;
  setLoggedIn:(loggedIn: boolean) => void
  onOpen: () => void;
  onClose: () => void;

}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  signupMode: false,
  loggedIn: false,
  name: "",
  setName:(name: string) => set({name}),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setSignupMode:(signupMode: boolean) => set({signupMode}),
  setLoggedIn:(loggedIn: boolean) => set({loggedIn})
}));

export default useAuthModal;
