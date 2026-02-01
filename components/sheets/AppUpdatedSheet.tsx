import { useRef } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";

export default function AppUpdatedSheet() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            background: {
                backgroundColor: colors.backdrop
            },
            handle: {
                backgroundColor: colors.background
            },
            container: {
                width: "100%",
                maxWidth: 400,
                padding: 20
            },
            header: {
                color: colors.text,
                fontSize: 24,
                fontWeight: "500",
                textAlign: "center",
                marginBottom: 10
            },
            text: {
                color: colors.text
            },
            rateText: {
                marginTop: 10
            }
        })
    );
    const actionSheetRef = useRef<ActionSheetRef>(null);

    const openChangelog = () => {
        actionSheetRef.current?.hide();
        router.push("/(modal)/changelog");
    };

    const openLink = async (url: string) => {
        await Linking.openURL(url);
    };

    return (
        <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={true}
            containerStyle={style.background}
            indicatorStyle={style.handle}
        >
            <View style={style.container}>
                <Text style={style.header}>{t("app:Modal.Updated.Title")}</Text>
                <Text style={style.text}>{t("app:Modal.Updated.Body")}</Text>

                <Button
                    text={t("app:Modal.Updated.Changelog")}
                    icon="history"
                    onPress={openChangelog}
                />

                <Text style={[style.text, style.rateText]}>{t("app:Modal.Updated.RateLongText")}</Text>

                {Platform.OS === "android" && (
                    <Button
                        text={t("app:About.RateGooglePlay")}
                        icon="star"
                        onPress={() => openLink("https://play.google.com/store/apps/details?id=io.github.snuutti.pallokala")}
                    />
                )}

                <Button
                    text={t("app:Modal.Updated.StarOnGitHub")}
                    icon="star"
                    onPress={() => openLink("https://github.com/snuutti/pallokala")}
                />
            </View>
        </ActionSheet>
    );
}