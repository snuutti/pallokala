import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import useLocalizedFormatter from "@/hooks/useLocalizedFormatter";
import { useStyle } from "@/hooks/useStyle";
import { getReleaseHistory, Release } from "@/utils/github";

export default function ChangelogScreen() {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            tag: {
                fontSize: 20,
                color: colors.text
            },
            published: {
                fontStyle: "italic",
                color: colors.text
            },
            body: {
                color: colors.text,
                marginTop: 10,
                marginBottom: 20
            }
        })
    );
    const { formatDate } = useLocalizedFormatter();
    const [changelog, setChangelog] = useState<Release[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getReleaseHistory().then((releases) => {
            setChangelog(releases);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!changelog.length) {
        return (
            <ContentWrapper>
                <Text style={style.body}>Failed to load changelog from GitHub! Are we rate limited?</Text>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper>
            {changelog
                .filter((release) => !release.prerelease)
                .map((release) => (
                <View key={release.tag_name}>
                    <Text style={style.tag}>{release.tag_name}</Text>
                    <Text style={style.published}>{formatDate(new Date(release.published_at))}</Text>
                    <Text style={style.body}>{release.body}</Text>
                </View>
            ))}
        </ContentWrapper>
    );
}