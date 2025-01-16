import { atom } from 'jotai'

export interface User {
  user_id: string
  email: string
  name: string
  role: string
  token: string
}

const initialUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null; // Fallback if parsing fails
  }
};

export const userAtom = atom<User | null>(initialUser());

// Atom to store authentication status (true or false)
export const isAuthenticatedAtom = atom(false);