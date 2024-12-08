import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { useTranslation } from "react-i18next";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import * as Localization from "expo-localization";
import Providers from "@/components/Providers";
import RootNavigation from "@/components/navigation/RootNavigation";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { setAppearanceColor } from "@/constants/Colors";
import "@/constants/i18n";

// Polyfill
import "fast-text-encoding";
import "@formatjs/intl-locale/polyfill";
import "@formatjs/intl-displaynames/polyfill";
import "@formatjs/intl-displaynames/locale-data/en";

SplashScreen.preventAutoHideAsync();

NavigationBar.setPositionAsync("absolute");
NavigationBar.setBackgroundColorAsync("#ffffff01");
NavigationBar.setButtonStyleAsync("dark");

export default function RootLayout() {
    const { i18n } = useTranslation();
    const [loaded] = useFonts({
        UbuntuMono: require("../assets/fonts/UbuntuMono-R.ttf"),
        UbuntuMonoBold: require("../assets/fonts/UbuntuMono-B.ttf"),
        UbuntuMonoItalic: require("../assets/fonts/UbuntuMono-RI.ttf"),
        UbuntuMonoBoldItalic: require("../assets/fonts/UbuntuMono-BI.ttf")
    });
    const savedLanguage = useSettingsStore(state => state.language);
    const colorScheme = useSettingsStore(state => state.colorScheme);
    const [languageLoaded, setLanguageLoaded] = useState(false);
    const [isAppearanceSet, setIsAppearanceSet] = useState(false);

    useEffect(() => {
        if (loaded && languageLoaded) {
            SplashScreen.hideAsync();
        }

        if (!languageLoaded) {
            let language = savedLanguage;
            if (language === "") {
                language = Localization.getLocales()[0].languageTag;
            }

            i18n.changeLanguage(language).then(() => setLanguageLoaded(true));
        }

        if (!isAppearanceSet) {
            setAppearanceColor(colorScheme);
            setIsAppearanceSet(true);
        }
    }, [loaded, languageLoaded, isAppearanceSet]);

    if (!loaded || !languageLoaded || !isAppearanceSet) {
        return null;
    }

    return (
        <Providers>
            <RootNavigation />
        </Providers>
    );
}