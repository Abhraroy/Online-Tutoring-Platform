import { create } from 'zustand';

const useZustandStore = create((set) => ({
    login: false,
    setLogin: (login) => set({ login }),
}))

export default useZustandStore;