import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import Providers from "@/components/Providers";
import RootNavigation from "@/components/navigation/RootNavigation";
import "@/constants/i18n";

// Polyfill
import "fast-text-encoding";

SplashScreen.preventAutoHideAsync();

NavigationBar.setPositionAsync("absolute");
NavigationBar.setBackgroundColorAsync("#ffffff01");
NavigationBar.setButtonStyleAsync("dark");

export default function RootLayout() {
    const [loaded] = useFonts({
        UbuntuMono: require("../assets/fonts/UbuntuMono-R.ttf"),
        UbuntuMonoBold: require("../assets/fonts/UbuntuMono-B.ttf"),
        UbuntuMonoItalic: require("../assets/fonts/UbuntuMono-RI.ttf"),
        UbuntuMonoBoldItalic: require("../assets/fonts/UbuntuMono-BI.ttf")
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
        <Providers>
            <RootNavigation />
        </Providers>
    );
}