import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorScheme, setAppearanceColor } from "@/constants/colors";

export type ThemeSettings = {
    color?: string;
};

export type TimeFormat = "locale" | "24h" | "12h";

export interface SettingsStore {
    language: string;
    colorScheme: ColorScheme;
    themeSettings: ThemeSettings;
    consoleFontSize: number;
    timeFormat: TimeFormat;
    sftpFileManager: boolean;
    disclaimerRead: boolean;
    previousVersion?: string;
    setLanguage: (language: string) => void;
    setColorScheme: (colorScheme: ColorScheme) => void;
    setThemeSettings: (settings: ThemeSettings) => void;
    setConsoleFontSize: (fontSize: number) => void;
    setTimeFormat: (timeFormat: TimeFormat) => void;
    setIsSFTPFileManager: (isSFTPFileManager: boolean) => void;
    setDisclaimerRead: () => void;
    setPreviousVersion: (version: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            language: "",
            colorScheme: "device",
            themeSettings: {},
            consoleFontSize: 14,
            timeFormat: "24h",
            sftpFileManager: true,
            disclaimerRead: false,
            previousVersion: undefined,
            setLanguage: (language) => set({ language }),
            setColorScheme: (colorScheme) => {
                setAppearanceColor(colorScheme);
                set({ colorScheme });
            },
            setThemeSettings: (settings) => set({ themeSettings: settings }),
            setConsoleFontSize: (fontSize) => set({ consoleFontSize: fontSize }),
            setTimeFormat: (timeFormat) => set({ timeFormat }),
            setIsSFTPFileManager: (isSFTPFileManager) => set({ sftpFileManager: isSFTPFileManager }),
            setDisclaimerRead: () => set({ disclaimerRead: true }),
            setPreviousVersion: (version) => set({ previousVersion: version })
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);