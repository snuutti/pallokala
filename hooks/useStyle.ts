import { useMemo } from "react";
import { useColorScheme as useColorSchemeRN } from "react-native";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ColorScheme, Colors, getColors, getNavigationColors } from "@/constants/Colors";

type StylingFunctionWithColors = (colors: Colors) => { [key: string]: any };
type StylingFunctionWithoutColors = () => { [key: string]: any };

type StylingFunction = StylingFunctionWithColors | StylingFunctionWithoutColors;

export function useStyle(styling: StylingFunction) {
    const colors = useColors();

    const style = useMemo(() => {
        if (styling.length > 0) {
            return (styling as StylingFunctionWithColors)(colors);
        }

        return (styling as StylingFunctionWithoutColors)();
    }, [colors, styling]);

    return { style, colors };
}

export function useColorScheme() {
    const colorScheme = useColorSchemeRN();
    const storedColorScheme = useSettingsStore(state => state.colorScheme);

    return storedColorScheme === "device" ? colorScheme as ColorScheme : storedColorScheme;
}

export function useColors() {
    const colorScheme = useColorScheme();
    const { color } = useSettingsStore(state => state.themeSettings);

    return useMemo(() => getColors(colorScheme, color), [colorScheme, color]);
}

export function useNavigationColors() {
    const colorScheme = useColorScheme();
    const { color } = useSettingsStore(state => state.themeSettings);

    return useMemo(() => getNavigationColors(colorScheme, color), [colorScheme, color]);
}