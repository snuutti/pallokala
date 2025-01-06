import { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal, ModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { useSettingsStore } from "@/stores/useSettingsStore";
import resources from "@/constants/resources";

export default function PreferencesScreen() {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            link: {
                color: colors.primary,
                marginHorizontal: 16
            }
        })
    );
    const { t, i18n } = useTranslation();
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createListModal, createColorPickerModal } = useModal();
    const { themeSettings, consoleFontSize, setLanguage, setColorScheme, setThemeSettings, setConsoleFontSize, setTimeFormat } = useSettingsStore();
    const [baseColor, setBaseColor] = useState(themeSettings.color || colors.primary);
    const [newConsoleFontSize, setNewConsoleFontSize] = useState(consoleFontSize);

    const pickLanguage = () => {
        const items: ModalButton[] = [];

        for (const locale in resources) {
            let [lang, region] = locale.split("_");
            if (locale === "sr_SP") {
                region = "RS";
            }

            const formatter = new Intl.DisplayNames(lang, { type: "language", languageDisplay: "standard" });

            items.push({
                text: formatter.of(`${lang}-${region}`)!,
                onPress: async () => {
                    setLanguage(locale);
                    await i18n.changeLanguage(locale);
                }
            });
        }

        createListModal(items);
    };

    const openCrowdin = async () => {
        await WebBrowser.openBrowserAsync("https://translate.pufferpanel.com");
    };

    const pickTheme = () => {
        createListModal(
            [
                {
                    text: t("common:theme.mode.Auto"),
                    icon: "cellphone",
                    onPress: () => setColorScheme("device")
                },
                {
                    text: t("common:theme.mode.Light"),
                    icon: "weather-sunny",
                    onPress: () => setColorScheme("light")
                },
                {
                    text: t("common:theme.mode.Dark"),
                    icon: "weather-night",
                    onPress: () => setColorScheme("dark")
                },
                {
                    text: "AMOLED",
                    icon: "cellphone",
                    onPress: () => setColorScheme("amoled")
                }
            ]
        );
    };

    const pickTimeFormat = () => {
        createListModal(
            [
                {
                    text: "Use Locale",
                    icon: "translate",
                    onPress: () => setTimeFormat("locale")
                },
                {
                    text: "12-hour",
                    icon: "biohazard",
                    onPress: () => setTimeFormat("12h")
                },
                {
                    text: "24-hour",
                    icon: "hand-okay",
                    onPress: () => setTimeFormat("24h")
                }
            ]
        );
    };

    const savePreferences = async () => {
        const settings = {
            ...themeSettings,
            color: baseColor
        };

        setThemeSettings(settings);
        setConsoleFontSize(newConsoleFontSize);

        await apiClient?.settings.setUserSetting("themeSettings", JSON.stringify(settings));

        showSuccess(t("users:PreferencesUpdated"));
    };

    return (
        <ContentWrapper>
            <Button
                text={t("common:Language")}
                icon="translate"
                onPress={pickLanguage}
            />

            <TouchableOpacity onPress={openCrowdin}>
                <Text style={style.link}>{t("common:HelpTranslate")}</Text>
            </TouchableOpacity>

            <Button
                text={t("common:theme.Theme")}
                icon="theme-light-dark"
                onPress={pickTheme}
            />

            <Button
                text={t("common:theme.BaseColor")}
                icon="palette"
                onPress={() => createColorPickerModal(t("common:theme.BaseColor"), baseColor, setBaseColor)}
            />

            <Slider
                label="Console Font Size (default 14)"
                description={`Current: ${newConsoleFontSize}`}
                value={newConsoleFontSize}
                onValueChange={setNewConsoleFontSize}
                lowerLimit={10}
                upperLimit={30}
                minimumValue={10}
                maximumValue={30}
                step={1}
            />

            <Button
                text="Time Format"
                icon="clock-outline"
                onPress={pickTimeFormat}
            />

            <Button
                text={t("users:SavePreferences")}
                icon="content-save"
                onPress={savePreferences}
            />
        </ContentWrapper>
    );
}