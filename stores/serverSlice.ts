import { StateCreator } from "zustand";
import { ExtendedServerView, ExtendedServerStatus } from "@/types/server";
import { UserPermissionsView } from "pufferpanel";

export interface ServerSlice {
    servers: ExtendedServerView[];
    serverUsers: Record<string, UserPermissionsView[]>;
    addServer: (server: ExtendedServerView) => void;
    setServers: (servers: ExtendedServerView[]) => void;
    modifyServer: (id: string, server: Partial<ExtendedServerView>) => void;
    setServerStatus: (id: string, status: ExtendedServerStatus) => void;
    removeServer: (id: string) => void;
    setServerUsers: (serverId: string, users: UserPermissionsView[]) => void;
    modifyServerUser: (serverId: string, email: string, user: Partial<UserPermissionsView>) => void;
    removeServerUser: (serverId: string, email: string) => void;
}

export const createServerSlice: StateCreator<ServerSlice> = (set) => ({
    servers: [],
    serverUsers: {},
    addServer: (server) => set(state => ({ servers: [...state.servers, server] })),
    setServers: (servers) => set({ servers }),
    modifyServer: (id, server) => set(state => ({ servers: state.servers.map(s => s.id === id ? { ...s, ...server } : s )})),
    setServerStatus: (id, status) => set(state => ({ servers: state.servers.map(s => s.id === id ? { ...s, online: status } : s )})),
    removeServer: (id) => {
        set(state => ({ servers: state.servers.filter(server => server.id !== id) }));
        set(state => ({ serverUsers: state.serverUsers[id] ? { ...state.serverUsers, [id]: [] } : state.serverUsers }));
    },
    setServerUsers: (serverId, users) => set(state => ({ serverUsers: { ...state.serverUsers, [serverId]: users }})),
    modifyServerUser: (serverId, email, user) => set(state => ({ serverUsers: { ...state.serverUsers, [serverId]: state.serverUsers[serverId].map(u => u.email === email ? { ...u, ...user } : u ) }})),
    removeServerUser: (serverId, email) => set(state => ({ serverUsers: { ...state.serverUsers, [serverId]: state.serverUsers[serverId].filter(u => u.email !== email) }}))
});