import { create } from "zustand";
import jwt_decode from "jwt-decode";

export const useUserStore = create((set) => ({
  user: null,
  setUserFromToken: (token) => {
    const decoded = jwt_decode(token);
    const { id, email, roles } = decoded;
    let rolesArray = [];
    if (typeof roles === "string") {
      rolesArray = roles.trim().split(",").map(r => r.trim());
    }
    set({ user: { id, email, roles: rolesArray } });
  },
  logout: () => set({ user: null }),
}));
