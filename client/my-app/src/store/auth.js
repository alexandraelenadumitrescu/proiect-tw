import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuth: ({ user, token, roles }) =>
    set(() => ({
      user,
      token,
    })),
  logout: () =>
    set(() => ({
      user: null,
      token: null,
    })),
}));
