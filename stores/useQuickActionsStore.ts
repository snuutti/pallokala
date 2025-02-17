import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as QuickActions from "expo-quick-actions";

export type ServerAction = {
    name: string;
    serverId: string;
    accountId: number;
};

export interface QuickActionsStore {
    actions: ServerAction[];
    addAction: (action: ServerAction) => void;
}

export const useQuickActionsStore = create<QuickActionsStore>()(
    persist(
        (set, get) => ({
            actions: [],
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
            }
        }),
        {
            name: "quick-actions-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);