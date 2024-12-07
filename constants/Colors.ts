import { Theme as NavigationTheme } from "@react-navigation/native";

export type ColorScheme = "device" | "light" | "dark";

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
const primaryHover = "#07a7e326";

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

export function getColors(colorScheme: ColorScheme): Colors {
    return colorScheme === "dark" ? darkColors : lightColors;
}

export function getNavigationColors(colorScheme: ColorScheme): NavigationTheme {
    const colors = getColors(colorScheme);

    return {
        dark: colorScheme === "dark",
        colors: {
            primary: colors.primary,
            background: colors.backdrop,
            card: colors.background,
            text: colors.text,
            border: colors.textDisabled,
            notification: colors.error
        }
    };
}