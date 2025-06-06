import { StateCreator } from "zustand";
import { User } from "pufferpanel";

export interface UserSlice {
    users: User[];
    currentUser: number;
    addUser: (user: User) => void;
    setUsers: (users: User[]) => void;
    modifyUser: (id: number, user: Partial<User>) => void;
    removeUser: (id: number) => void;
    setCurrentUser: (id: number) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
    users: [],
    currentUser: -1,
    addUser: (user) => set(state => ({ users: [...state.users, user] })),
    setUsers: (users) => set({ users }),
    modifyUser: (id, user) => set(state => ({ users: state.users.map(u => u.id === id ? { ...u, ...user } : u )})),
    removeUser: (id) => set(state => ({ users: state.users.filter(user => user.id !== id) })),
    setCurrentUser: (id) => set({ currentUser: id })
});