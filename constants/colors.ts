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
    codeBackground: string;
    text: string;
    textDisabled: string;
    textPrimary: string;
    success: string;
    successBg: string;
    info: string;
    infoBg: string;
    warning: string;
    warningBg: string;
    error: string;
    errorBg: string;
    serverTypeIconFilter: string;
};

const primary = "#07a7e3";
const primaryHover = deriveOpacity(primary, 0.15);

export const darkColors: Colors = {
    primary: primary,
    primaryHover: primaryHover,
    backdrop: "#292929",
    background: "#333",
    codeBackground: "#1d1d1d",
    text: "rgba(240, 240, 240, 0.87)",
    textDisabled: "rgba(240, 240, 240, 0.5)",
    textPrimary: "#eee",
    success: "#4caf50",
    successBg: "#4caf5040",
    info: "#3b8db8",
    infoBg: "#3b8db840",
    warning: "#fbac00",
    warningBg: "#fbac0040",
    error: "#fe4242",
    errorBg: "#fe424240",
    serverTypeIconFilter: "brightness(0.625)"
};

export const lightColors: Colors = {
    primary: primary,
    primaryHover: primaryHover,
    backdrop: "#eee",
    background: "#fff",
    codeBackground: "#d9d9d9",
    text: "rgba(16, 16, 16, 0.75)",
    textDisabled: "rgba(16, 16, 16, 0.5)",
    textPrimary: "#eee",
    success: "#4caf50",
    successBg: "#4caf5040",
    info: "#21a1de",
    infoBg: "#21a1de40",
    warning: "#fb8c00",
    warningBg: "#fb8c0040",
    error: "#dc3131",
    errorBg: "#dc313140",
    serverTypeIconFilter: "none"
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