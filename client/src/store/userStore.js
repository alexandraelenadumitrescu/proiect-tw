import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const useUserStore = create((set) => ({
  user: null,
  setUserFromToken: (token) => {
    const decoded = jwtDecode(token);
    const { id, email, roles } = decoded;
    let rolesArray = [];
    if (typeof roles === 'string') {
      rolesArray = roles
        .trim()
        .split(',')
        .map((r) => r.trim());
    }
    set({ user: { id, email, roles: rolesArray } });
  },
  logout: () => set({ user: null }),
}));

export default useUserStore;
