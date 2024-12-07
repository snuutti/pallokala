import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useModal, ModalButton } from "@/context/ModalProvider";
import { useColors } from "@/hooks/useStyle";
import { useSettingsStore } from "@/stores/useSettingsStore";
import resources from "@/constants/resources";

export default function PreferencesScreen() {
    const colors = useColors();
    const { t, i18n } = useTranslation();
    const { createListModal } = useModal();
    const { setLanguage, setColorScheme } = useSettingsStore();

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

    const pickTheme = () => {
        createListModal(
            [
                {
                    text: "System",
                    icon: "cellphone",
                    onPress: () => setColorScheme("device")
                },
                {
                    text: "Light",
                    icon: "weather-sunny",
                    onPress: () => setColorScheme("light")
                },
                {
                    text: "Dark",
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

    return (
        <ContentWrapper>
            <Button
                text={t("common:Language")}
                icon="translate"
                onPress={pickLanguage}
            />

            <Button
                text="Theme"
                icon="theme-light-dark"
                onPress={pickTheme}
            />
        </ContentWrapper>
    );
}