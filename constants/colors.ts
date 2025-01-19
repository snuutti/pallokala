import { Appearance } from "react-native";
import { Theme as NavigationTheme, DefaultTheme } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";
import { deriveOpacity, deriveContrast } from "@/utils/theme";

export type ColorScheme = "device" | "light" | "dark" | "amoled";

export type Colors = {
    primary: string;
    primaryHover: string;
    backdrop: string;
    background: string;
    text: string;
    textDisabled: string;
    textPrimary: string;
    success: string;
    error: string;
};

const primary = "#07a7e3";
const primaryHover = deriveOpacity(primary, 0.15);

export const darkColors: Colors = {
    primary: primary,
    primaryHover: primaryHover,
    backdrop: "#292929",
    background: "#333",
    text: "rgba(240, 240, 240, 0.87)",
    textDisabled: "rgba(240, 240, 240, 0.5)",
    textPrimary: "#eee",
    success: "#4caf50",
    error: "#fe4242"
};

export const lightColors: Colors = {
    primary: primary,
    primaryHover: primaryHover,
    backdrop: "#eee",
    background: "#fff",
    text: "rgba(16, 16, 16, 0.75)",
    textDisabled: "rgba(16, 16, 16, 0.5)",
    textPrimary: "#eee",
    success: "#4caf50",
    error: "#dc3131"
};

export const amoledColors: Colors = {
    ...darkColors,
    backdrop: "#000",
    background: "#0f0f0f"
};

export function getColors(colorScheme: ColorScheme, primaryColor?: string): Colors {
    let colors: Colors;
    switch (colorScheme) {
        case "light":
            colors = { ...lightColors };
            break;
        case "dark":
            colors = { ...darkColors };
            break;
        case "amoled":
            colors = { ...amoledColors };
            break;
        default:
            colors = { ...lightColors };
            break;
    }

    if (primaryColor) {
        colors.primary = primaryColor;
        colors.primaryHover = deriveOpacity(primaryColor, 0.15);
        colors.textPrimary = deriveContrast(primaryColor, ["#eee", "#333"], true);
    }

    return colors;
}

export function getNavigationColors(colorScheme: ColorScheme, primaryColor?: string): NavigationTheme {
    const colors = getColors(colorScheme, primaryColor);

    return {
        dark: colorScheme === "dark" || colorScheme === "amoled",
        colors: {
            primary: colors.primary,
            background: colors.backdrop,
            card: colors.background,
            text: colors.text,
            border: colors.textDisabled,
            notification: colors.error
        },
        fonts: DefaultTheme.fonts
    };
}

export function setAppearanceColor(colorScheme: ColorScheme) {
    Appearance.setColorScheme(colorScheme === "device" ? null : colorScheme === "light" ? "light" : "dark");
    SystemUI.setBackgroundColorAsync(getColors(colorScheme).backdrop);
}