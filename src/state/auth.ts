import { atom } from 'react-atomic-state'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom(false)

// Auth actions
export const login = (userData: User) => {
  userAtom.set(userData)
  isAuthenticatedAtom.set(true)
}

export const logout = () => {
  userAtom.set(null)
  isAuthenticatedAtom.set(false)
}