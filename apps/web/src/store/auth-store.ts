import { create } from "zustand";
import type { User } from "../types/api";
import { api, configureApiAuth } from "../lib/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isBootstrapping: boolean;
  setSession: (user: User, accessToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: { name: string; email: string; password: string }) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapping: true,
  setSession: (user, accessToken) => set({ user, accessToken, isBootstrapping: false }),
  login: async (email, password) => {
    const { data } = await api.post<{ user: User; accessToken: string }>("/auth/login", { email, password });
    set({ user: data.user, accessToken: data.accessToken, isBootstrapping: false });
  },
  signup: async (input) => {
    const { data } = await api.post<{ user: User; accessToken: string }>("/auth/signup", input);
    set({ user: data.user, accessToken: data.accessToken, isBootstrapping: false });
  },
  refresh: async () => {
    try {
      const { data } = await api.post<{ user: User; accessToken: string }>("/auth/refresh");
      set({ user: data.user, accessToken: data.accessToken, isBootstrapping: false });
    } catch {
      set({ user: null, accessToken: null, isBootstrapping: false });
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, accessToken: null, isBootstrapping: false });
    }
  }
}));

configureApiAuth({
  getAccessToken: () => useAuthStore.getState().accessToken,
  refreshSession: async () => {
    await useAuthStore.getState().refresh();
    return useAuthStore.getState().accessToken;
  }
});
