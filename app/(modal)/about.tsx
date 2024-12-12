import { ComponentProps } from "react";
import { Image } from "expo-image";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import * as Application from "expo-application";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import { useStyle } from "@/hooks/useStyle";

export default function AboutScreen() {
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
                    title="Source code"
                    subline="https://github.com/snuutti/pallokala"
                    icon="xml"
                    onPress={() => openLink("https://github.com/snuutti/pallokala")}
                />

                <LinkItem
                    title="Report an issue"
                    subline="(or request a feature)"
                    icon="bug"
                    onPress={() => openLink("https://github.com/snuutti/pallokala/issues/new/choose")}
                />

                <LinkItem
                    title="Rate on Google Play"
                    subline="Thank you! ❤️️"
                    icon="star"
                    onPress={() => openLink("https://play.google.com/store/apps/details?id=io.github.snuutti.pallokala")}
                />
            </View>

            <Text style={style.text}>
                Pallokala version {Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
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
                borderRadius: 15
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