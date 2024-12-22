import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorScheme, setAppearanceColor } from "@/constants/Colors";

export type ThemeSettings = {
    color?: string;
};

export interface SettingsStore {
    language: string;
    colorScheme: ColorScheme;
    themeSettings: ThemeSettings;
    disclaimerRead: boolean;
    previousVersion?: string;
    setLanguage: (language: string) => void;
    setColorScheme: (colorScheme: ColorScheme) => void;
    setThemeSettings: (settings: ThemeSettings) => void;
    setDisclaimerRead: () => void;
    setPreviousVersion: (version: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            language: "",
            colorScheme: "device",
            themeSettings: {},
            disclaimerRead: false,
            previousVersion: undefined,
            setLanguage: (language) => set({ language }),
            setColorScheme: (colorScheme) => {
                setAppearanceColor(colorScheme);
                set({ colorScheme });
            },
            setThemeSettings: (settings) => set({ themeSettings: settings }),
            setDisclaimerRead: () => set({ disclaimerRead: true }),
            setPreviousVersion: (version) => set({ previousVersion: version })
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);