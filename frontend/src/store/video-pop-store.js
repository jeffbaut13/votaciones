import { create } from "zustand";

export const usePopOpenStore = create((set) => ({
  isOpen: false,
  openVideo: false,
  play: false,
  url: null,
  openPop: () => set({ isOpen: true }),
  closePop: () => set({ isOpen: false, openVideo: false, play: false, url: null }),
  closeVideo: () => set({ play: false, url: null, openVideo: false }),
  openSelectedVideo: (url) => set({ url, openVideo: true, play: true }),
  setPlayState: (play) => set({ play }),
  togglePlay: () =>
    set((state) => ({ play: !state.play })),
}));
