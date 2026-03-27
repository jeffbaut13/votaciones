import { create } from "zustand";

const initialSession = {
  phone: "",
  requestId: "",
  verificationStatus: "idle",
  isAuthenticated: false,
  hasVoted: false,
};

function loadPersistedState() {
  if (typeof window === "undefined") {
    return initialSession;
  }

  try {
    const raw = window.localStorage.getItem("votaciones-auth");
    return raw ? { ...initialSession, ...JSON.parse(raw) } : initialSession;
  } catch {
    return initialSession;
  }
}

function persistState(session) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("votaciones-auth", JSON.stringify(session));
  }
}

export const useAuthStore = create((set) => ({
  session: loadPersistedState(),
  setPhoneCheckResult: (payload) =>
    set((state) => {
      const session = {
        ...state.session,
        phone: payload.phone,
        requestId: payload.requestId || "",
        hasVoted: Boolean(payload.hasVoted),
        verificationStatus: payload.hasVoted ? "blocked" : "otp-sent",
      };
      persistState(session);
      return { session };
    }),
  markVerified: () =>
    set((state) => {
      const session = {
        ...state.session,
        isAuthenticated: true,
        verificationStatus: "verified",
      };
      persistState(session);
      return { session };
    }),
  markVoteCompleted: () =>
    set((state) => {
      const session = {
        ...state.session,
        hasVoted: true,
      };
      persistState(session);
      return { session };
    }),
  resetSession: () => {
    persistState(initialSession);
    return set({ session: initialSession });
  },
}));
