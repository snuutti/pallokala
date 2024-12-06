import { StateCreator } from "zustand";
import { ExtendedServerView, ExtendedServerStatus } from "@/types/server";

export interface ServerSlice {
    servers: ExtendedServerView[];
    addServer: (server: ExtendedServerView) => void;
    setServers: (servers: ExtendedServerView[]) => void;
    modifyServer: (id: string, server: Partial<ExtendedServerView>) => void;
    setServerStatus: (id: string, status: ExtendedServerStatus) => void;
    removeServer: (id: string) => void;
}

export const createServerSlice: StateCreator<ServerSlice> = (set) => ({
    servers: [],
    addServer: (server) => set(state => ({ servers: [...state.servers, server] })),
    setServers: (servers) => set({ servers }),
    modifyServer: (id, server) => set(state => ({ servers: state.servers.map(s => s.id === id ? { ...s, ...server } : s )})),
    setServerStatus: (id, status) => set(state => ({ servers: state.servers.map(s => s.id === id ? { ...s, online: status } : s )})),
    removeServer: (id) => set(state => ({ servers: state.servers.filter(server => server.id !== id) }))
});