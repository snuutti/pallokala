import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { useTranslation } from "react-i18next";
import { ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Localization from "expo-localization";
import { SystemBars } from "react-native-edge-to-edge";
import Providers from "@/components/Providers";
import RootNavigation from "@/components/navigation/RootNavigation";
import ErrorBoundaryScreen from "@/components/screen/ErrorBoundaryScreen";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { setAppearanceColor } from "@/constants/colors";
import "@/constants/i18n";

// Polyfill
import "@formatjs/intl-locale/polyfill";
import "@formatjs/intl-displaynames/polyfill";
import "@formatjs/intl-displaynames/locale-data/en";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 1000,
    fade: true
});

export default function RootLayout() {
    const { i18n } = useTranslation();
    const [loaded] = useFonts({
        UbuntuMono: require("../assets/fonts/UbuntuMono-R.ttf"),
        UbuntuMonoBold: require("../assets/fonts/UbuntuMono-B.ttf"),
        UbuntuMonoItalic: require("../assets/fonts/UbuntuMono-RI.ttf"),
        UbuntuMonoBoldItalic: require("../assets/fonts/UbuntuMono-BI.ttf")
    });
    const savedLanguage = useSettingsStore(state => state.language);
    const setLanguage = useSettingsStore(state => state.setLanguage);
    const colorScheme = useSettingsStore(state => state.colorScheme);
    const [languageLoaded, setLanguageLoaded] = useState(false);
    const [isAppearanceSet, setIsAppearanceSet] = useState(false);

    useEffect(() => {
        if (loaded && languageLoaded) {
            SplashScreen.hide();
        }

        if (!languageLoaded) {
            let language = savedLanguage;
            if (language === "") {
                language = Localization.getLocales()[0].languageTag.replaceAll("-", "_");
                setLanguage(language);
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
            <SystemBars style="auto" />
            <RootNavigation />
        </Providers>
    );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
    return <ErrorBoundaryScreen error={error} retry={retry} />;
}