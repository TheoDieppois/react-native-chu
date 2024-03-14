// avatarStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAvatarStore = create((set) => ({
  selectedAvatar: null,
  setSelectedAvatar: async (avatar) => {
    set({ selectedAvatar: avatar });
    try {
      await AsyncStorage.setItem("selectedAvatar", JSON.stringify(avatar));
    } catch (error) {
      console.error("Error saving selected avatar:", error);
    }
  },
  loadSelectedAvatar: async () => {
    try {
      const storedAvatar = await AsyncStorage.getItem("selectedAvatar");
      if (storedAvatar !== null) {
        set({ selectedAvatar: JSON.parse(storedAvatar) });
      }
    } catch (error) {
      console.error("Error loading selected avatar:", error);
    }
  },
}));

// Load the selected avatar when the store is initialized
useAvatarStore.getState().loadSelectedAvatar();

export default useAvatarStore;
