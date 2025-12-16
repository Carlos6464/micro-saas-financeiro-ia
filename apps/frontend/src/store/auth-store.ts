import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  sub: number;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => {
        localStorage.setItem('token', token); // Salva também no storage puro para o Axios ler rápido
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage
    }
  )
);