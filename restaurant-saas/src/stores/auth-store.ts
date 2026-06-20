import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  restaurantId?: string | null;
}

interface Restaurant {
  id: string;
  name: string;
  logo?: string | null;
  currency: string;
  timezone: string;
}

interface AuthState {
  user: User | null;
  restaurant: Restaurant | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  setAuth: (user: User, restaurant: Restaurant | null, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      restaurant: null,
      accessToken: null,
      isAuthenticated: false,
      
      setAuth: (user, restaurant, token) => set({
        user,
        restaurant,
        accessToken: token,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        restaurant: null,
        accessToken: null,
        isAuthenticated: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
