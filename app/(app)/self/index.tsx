import { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import Switch from "@/components/ui/Switch";
import { useApiClient } from "@/context/ApiClientProvider";
import { useModal, ListModalButton } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import useIsTestMode from "@/hooks/useIsTestMode";
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
    const { createListModal, createColorPickerModal } = useModal();
    const { showSuccessAlert } = useToast();
    const isTestMode = useIsTestMode();
    const {
        colorScheme,
        themeSettings,
        consoleFontSize,
        timeFormat,
        sftpFileManager,
        setLanguage,
        setColorScheme,
        setThemeSettings,
        setConsoleFontSize,
        setTimeFormat,
        setIsSFTPFileManager
    } = useSettingsStore();
    const [baseColor, setBaseColor] = useState(themeSettings.color || colors.primary);
    const [newConsoleFontSize, setNewConsoleFontSize] = useState(consoleFontSize);
    const [newSFTPFileManager, setNewSFTPFileManager] = useState(sftpFileManager);

    const pickLanguage = () => {
        const items: ListModalButton[] = [];

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
                },
                selected: locale === i18n.language
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
                    onPress: () => setColorScheme("device"),
                    selected: colorScheme === "device"
                },
                {
                    text: t("common:theme.mode.Light"),
                    icon: "weather-sunny",
                    onPress: () => setColorScheme("light"),
                    selected: colorScheme === "light"
                },
                {
                    text: t("common:theme.mode.Dark"),
                    icon: "weather-night",
                    onPress: () => setColorScheme("dark"),
                    selected: colorScheme === "dark"
                },
                {
                    text: "AMOLED",
                    icon: "cellphone",
                    onPress: () => setColorScheme("amoled"),
                    selected: colorScheme === "amoled"
                }
            ]
        );
    };

    const pickTimeFormat = () => {
        createListModal(
            [
                {
                    text: t("app:Self.Preferences.TimeFormat.Locale"),
                    icon: "translate",
                    onPress: () => setTimeFormat("locale"),
                    selected: timeFormat === "locale"
                },
                {
                    text: t("app:Self.Preferences.TimeFormat.12"),
                    icon: "biohazard",
                    onPress: () => setTimeFormat("12h"),
                    selected: timeFormat === "12h"
                },
                {
                    text: t("app:Self.Preferences.TimeFormat.24"),
                    icon: "hand-okay",
                    onPress: () => setTimeFormat("24h"),
                    selected: timeFormat === "24h"
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
        setIsSFTPFileManager(newSFTPFileManager);

        await apiClient?.settings.setUserSetting("themeSettings", JSON.stringify(settings));

        showSuccessAlert(t("users:PreferencesUpdated"));
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
                label={t("app:Self.Preferences.ConsoleFontSize")}
                description={t("app:Self.Preferences.ConsoleFontSizeDesc", { size: consoleFontSize })}
                value={newConsoleFontSize}
                onValueChange={setNewConsoleFontSize}
                lowerLimit={10}
                upperLimit={30}
                minimumValue={10}
                maximumValue={30}
                step={1}
            />

            <Button
                text={t("app:Self.Preferences.TimeFormat.TimeFormat")}
                icon="clock-outline"
                onPress={pickTimeFormat}
            />

            {Platform.OS === "android" && (
                <Switch
                    label={t("app:Self.Preferences.Sftp")}
                    description={t("app:Self.Preferences.SftpDesc")}
                    value={isTestMode ? false : newSFTPFileManager}
                    onValueChange={isTestMode ? () => {} : setNewSFTPFileManager}
                    disabled={isTestMode}
                />
            )}

            <Button
                text={t("users:SavePreferences")}
                icon="content-save"
                onPress={savePreferences}
            />
        </ContentWrapper>
    );
}