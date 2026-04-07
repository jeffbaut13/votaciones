import { create } from "zustand";

export const usePopOpenStore = create((set) => ({
  isOpen: false,
  openVideo: false,
  play: false,
  url: null,
  colorBg: "primary", // "primary" | "secondary" | null
  openPop: () => set({ isOpen: true }),
  closePop: () =>
    set({
      isOpen: false,
      openVideo: false,
      play: false,
      url: null,
      colorBg: null,
    }),
  closeVideo: () =>
    set({ play: false, url: null, openVideo: false, colorBg: null }),
  openSelectedVideo: (url, color) =>
    set({ url, openVideo: true, play: true, colorBg: color }),
  setPlayState: (play) => set({ play }),
  togglePlay: () => set((state) => ({ play: !state.play })),
}));
