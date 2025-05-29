import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as QuickActions from "expo-quick-actions";

export type CurrentAction = {
    serverId: string;
    accountId: number;
};

export type ServerAction = {
    name: string;
    serverId: string;
    accountId: number;
};

export interface QuickActionsStore {
    currentAction: CurrentAction | null;
    actions: ServerAction[];
    setCurrentAction: (action: CurrentAction | null) => void;
    addAction: (action: ServerAction) => void;
    removeAccountActions: (accountId: number) => void;
}

export const useQuickActionsStore = create<QuickActionsStore>()(
    persist(
        (set, get) => ({
            currentAction: null,
            actions: [],
            setCurrentAction: (action) => set({ currentAction: action }),
            addAction: (action) => {
                const currentActions = get().actions;
                const actionIndex = currentActions.findIndex((a) => a.serverId === action.serverId
                    && a.accountId === action.accountId);

                let newActions: ServerAction[];

                if (actionIndex !== -1) {
                    const filteredActions = currentActions.filter((_, index) => index !== actionIndex);
                    newActions = [action, ...filteredActions];
                } else {
                    newActions = [action, ...currentActions];
                    if (newActions.length > 4) {
                        newActions = newActions.slice(0, 4);
                    }
                }

                set({ actions: newActions });

                QuickActions.setItems(newActions.map((a) => ({
                    id: a.accountId + "." + a.serverId,
                    title: a.name,
                    params: { accountId: a.accountId, serverId: a.serverId }
                })));
            },
            removeAccountActions: (accountId) => {
                const currentActions = get().actions;
                const newActions = currentActions.filter((a) => a.accountId !== accountId);
                set({ actions: newActions });

                QuickActions.setItems(newActions.map((a) => ({
                    id: a.accountId + "." + a.serverId,
                    title: a.name,
                    params: { accountId: a.accountId, serverId: a.serverId }
                })));
            }
        }),
        {
            name: "quick-actions-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ actions: state.actions })
        }
    )
);