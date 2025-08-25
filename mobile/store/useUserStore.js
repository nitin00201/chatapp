import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Use web localStorage if on web, else AsyncStorage
const getStorage = () => {
  if (Platform.OS === "web") {
    return {
      getItem: (key) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key, value) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key) => {
        localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }
  return AsyncStorage;
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      error: null,

      setUser: (user) => {
        console.log("✅ Setting user in store:", user);
        set({ user, error: null });
      },

      clearUser: () => {
        console.log("🗑️ Clearing user from store");
        set({ user: null, error: null });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          console.log("✏️ Updating user in store:", updatedUser);
          set({ user: updatedUser });
        }
      },

      isAuthenticated: () => {
        return !!get().user;
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => getStorage()),
      version: 1,
      migrate: (persistedState, version) => {
        // handle breaking changes if schema changes later
        console.log("♻️ Migrating user store", { persistedState, version });
        return persistedState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.log("⚠️ User store rehydration error:", error);
        } else {
          console.log("✅ User store rehydrated successfully:", state?.user);
        }
      },
    }
  )
);
