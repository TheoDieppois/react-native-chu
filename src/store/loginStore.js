import { create } from "zustand";

export const loginStore = create((set) => ({
  // bears: 0,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  isLogged: false,
  setIsLogged: (value) => set((state) => ({ isLogged: value })),
  chuId: "",
  setChuId: (enteredId) => set((state) => ({ chuId: enteredId })),
  pkId: "",
  setPkId: (enteredId) => set((state) => ({ pkId: enteredId })),
  password: "",
  setPassword: (enteredPassword) =>
    set((state) => ({ password: enteredPassword })),
  challengeId: "",
  setChallengeId: (id) => set((state) => ({ challengeId: id })),
  alreadyLoggedOnce: true,
  setAlreadyLoggedOnce: (firstLogging) =>
    set((state) => ({ alreadyLoggedOnce: firstLogging })),
}));
