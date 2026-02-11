import { ComponentProps } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import * as Application from "expo-application";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";

export default function AboutScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            banner: {
                aspectRatio: 4
            },
            linkContainer: {
                marginVertical: 20
            },
            text: {
                textAlign: "center",
                color: colors.text
            }
        })
    );
    const { version } = useApiClient();

    const openLink = async (url: string) => {
        await Linking.openURL(url);
    };

    return (
        <ContentWrapper>
            <Image
                source={require("@/assets/images/banner.png")}
                style={style.banner}
                contentFit="contain"
            />

            <View style={style.linkContainer}>
                <LinkItem
                    title={t("app:About.SourceCode")}
                    subline="https://github.com/snuutti/pallokala"
                    icon="xml"
                    onPress={() => openLink("https://github.com/snuutti/pallokala")}
                />

                <LinkItem
                    title={t("app:About.ReportIssue")}
                    subline={t("app:About.ReportIssueSubline")}
                    icon="bug"
                    onPress={() => openLink("https://github.com/snuutti/pallokala/issues/new/choose")}
                />

                {Platform.OS === "android" && (
                    <LinkItem
                        title={t("app:About.RateGooglePlay")}
                        subline={t("app:About.RateGooglePlaySubline")}
                        icon="star"
                        onPress={() => openLink("https://play.google.com/store/apps/details?id=io.github.snuutti.pallokala")}
                    />
                )}

                <LinkItem
                    title={t("app:About.Changelog")}
                    subline={t("app:About.ChangelogSubline", { version: Application.nativeApplicationVersion })}
                    icon="history"
                    onPress={() => router.push("/(modal)/changelog")}
                />

                <LinkItem
                    title={t("app:About.PrivacyPolicy")}
                    subline={t("app:About.PrivacyPolicySubline")}
                    icon="shield-lock"
                    onPress={() => openLink("https://raw.githubusercontent.com/snuutti/pallokala/refs/heads/master/PRIVACY.MD")}
                />
            </View>

            <Text style={style.text}>
                {t("app:About.AppVersion", { version: Application.nativeApplicationVersion, build: Application.nativeBuildVersion })}
            </Text>

            <Text style={style.text}>
                {t("app:About.PanelVersion", { version })}
            </Text>
        </ContentWrapper>
    );
}

type LinkItemProps = {
    title: string;
    subline: string;
    icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
    onPress: () => void;
};

function LinkItem(props: LinkItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            item: {
                padding: 15,
                flexGrow: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.background,
                marginVertical: 5,
                borderRadius: 15,
                boxShadow: colors.raised
            },
            icon: {
                marginRight: 10
            },
            textContainer: {
                flex: 1
            },
            title: {
                color: colors.text
            },
            subline: {
                color: colors.textDisabled
            }
        })
    );

    return (
        <TouchableOpacity style={style.item} onPress={props.onPress}>
            <MaterialCommunityIcons name={props.icon} size={30} color={colors.text} style={style.icon} />

            <View style={style.textContainer}>
                <Text style={style.title} numberOfLines={1}>{props.title}</Text>
                <Text style={style.subline} numberOfLines={1}>{props.subline}</Text>
            </View>
        </TouchableOpacity>
    );
}