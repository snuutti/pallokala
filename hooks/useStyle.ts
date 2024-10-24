import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { Colors, getColors, getNavigationColors } from "@/constants/Colors";

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

export function useColors() {
    const colorScheme = useColorScheme();

    return useMemo(() => getColors(colorScheme), [colorScheme]);
}

export function useNavigationColors() {
    const colorScheme = useColorScheme();

    return useMemo(() => getNavigationColors(colorScheme), [colorScheme]);
}