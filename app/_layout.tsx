import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { ApiClientProvider } from "@/context/ApiClientProvider";
import { AccountProvider } from "@/context/AccountProvider";
import { SwitchServerModalProvider } from "@/context/SwitchServerModalProvider";

SplashScreen.preventAutoHideAsync();

NavigationBar.setPositionAsync("absolute");
NavigationBar.setBackgroundColorAsync("#ffffff01");
NavigationBar.setButtonStyleAsync("dark");

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        UbuntuMono: require("../assets/fonts/UbuntuMono-R.ttf"),
        UbuntuMonoBold: require("../assets/fonts/UbuntuMono-B.ttf")
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <BottomSheetModalProvider>
                    <ApiClientProvider>
                        <AccountProvider>
                            <SwitchServerModalProvider>
                                <Slot />
                            </SwitchServerModalProvider>
                        </AccountProvider>
                    </ApiClientProvider>
                </BottomSheetModalProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}