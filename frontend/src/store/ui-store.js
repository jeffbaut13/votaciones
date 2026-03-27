import { create } from "zustand";

export const useUiStore = create((set) => ({
  isSubmitting: false,
  feedback: null,
  setSubmitting: (value) => set({ isSubmitting: value }),
  setFeedback: (feedback) => set({ feedback }),
  clearFeedback: () => set({ feedback: null }),
}));
