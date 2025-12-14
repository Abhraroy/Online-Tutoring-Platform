import { create } from 'zustand';

const useZustandStore = create((set) => ({
    login: false,
    setLogin: (login) => set({ login }),
    user: null,
    setUser: (user) => set({ user }),
    userData: null,
    setUserData: (userData) => set({ userData }),
}))

export default useZustandStore;