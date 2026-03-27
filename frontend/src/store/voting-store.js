import { create } from "zustand";

const initialState = {
  currentStep: 1,
  selectedOption: "",
  summary: { A: 0, B: 0 },
  records: [],
};

function loadPersistedState() {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const raw = window.localStorage.getItem("votaciones-voting");
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

function persistState(state) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("votaciones-voting", JSON.stringify(state));
  }
}

export const useVotingStore = create((set) => ({
  ...loadPersistedState(),
  setStep: (step) =>
    set((state) => {
      const next = { ...state, currentStep: step };
      persistState(next);
      return next;
    }),
  selectOption: (option) =>
    set((state) => {
      const next = { ...state, selectedOption: option };
      persistState(next);
      return next;
    }),
  hydrateSummary: (summary) =>
    set((state) => {
      const next = { ...state, summary };
      persistState(next);
      return next;
    }),
  hydrateRecords: (records) =>
    set((state) => {
      const next = { ...state, records };
      persistState(next);
      return next;
    }),
}));
