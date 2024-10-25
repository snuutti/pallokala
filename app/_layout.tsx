import { useEffect } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@react-navigation/native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { ToastProvider } from "@/context/ToastProvider";
import { ModalProvider } from "@/context/ModalProvider";
import { ApiClientProvider } from "@/context/ApiClientProvider";
import { AccountProvider } from "@/context/AccountProvider";
import { SwitchServerModalProvider } from "@/context/SwitchServerModalProvider";
import { ServerProvider } from "@/context/ServerProvider";
import { useNavigationColors } from "@/hooks/useStyle";

// Polyfill
import "fast-text-encoding";

SplashScreen.preventAutoHideAsync();

NavigationBar.setPositionAsync("absolute");
NavigationBar.setBackgroundColorAsync("#ffffff01");
NavigationBar.setButtonStyleAsync("dark");

export default function RootLayout() {
    const theme = useNavigationColors();
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
            <ThemeProvider value={theme}>
                <KeyboardProvider statusBarTranslucent={true} navigationBarTranslucent={true}>
                    <ToastProvider>
                        <ModalProvider>
                            <BottomSheetModalProvider>
                                <ApiClientProvider>
                                    <AccountProvider>
                                        <SwitchServerModalProvider>
                                            <ServerProvider>
                                                <Slot />
                                            </ServerProvider>
                                        </SwitchServerModalProvider>
                                    </AccountProvider>
                                </ApiClientProvider>
                            </BottomSheetModalProvider>
                        </ModalProvider>
                    </ToastProvider>
                </KeyboardProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}