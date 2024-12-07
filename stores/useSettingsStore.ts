import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorScheme } from "@/constants/Colors";

export interface SettingsStore {
    language: string;
    colorScheme: ColorScheme;
    disclaimerRead: boolean;
    setLanguage: (language: string) => void;
    setColorScheme: (colorScheme: ColorScheme) => void;
    setDisclaimerRead: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            language: "",
            colorScheme: "device",
            disclaimerRead: false,
            setLanguage: (language) => set({ language }),
            setColorScheme: (colorScheme) => set({ colorScheme }),
            setDisclaimerRead: () => set({ disclaimerRead: true })
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);