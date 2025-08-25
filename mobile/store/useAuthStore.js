import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../lib/axios";
import { useUserStore } from "./useUserStore";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/auth/login", credentials);
          console.log("🔑 Login API Response:", res.data);

          const { token, ...user } = res.data; // split user + token

          set({ token, isAuthenticated: true, loading: false });
          useUserStore.getState().setUser(user);

          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Login failed",
            loading: false,
          });
          throw err;
        }
      },

      register: async (formData) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/auth/register", formData);
          console.log("📝 Register API Response:", res.data);

          const { token, ...user } = res.data;

          set({ token, isAuthenticated: true, loading: false });
          useUserStore.getState().setUser(user);

          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Registration failed",
            loading: false,
          });
          throw err;
        }
      },

      logout: () => {
        console.log("🚪 Logging out user");
        set({ token: null, isAuthenticated: false });
        useUserStore.getState().clearUser();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState, version) => {
        console.log("♻️ Migrating auth store", { persistedState, version });
        return persistedState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.log("⚠️ Auth store rehydration error:", error);
        } else {
          console.log("✅ Auth store rehydrated successfully");
        }
      },
    }
  )
);
