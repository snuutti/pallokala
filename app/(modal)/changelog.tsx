import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import { useStyle } from "@/hooks/useStyle";
import { getReleaseHistory, Release } from "@/utils/github";

const formatDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

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

    return (
        <ContentWrapper>
            {changelog
                .filter((release) => !release.prerelease)
                .map((release) => (
                <View key={release.tag_name}>
                    <Text style={style.tag}>{release.tag_name}</Text>
                    <Text style={style.published}>{formatDate.format(new Date(release.published_at))}</Text>
                    <Text style={style.body}>{release.body}</Text>
                </View>
            ))}
        </ContentWrapper>
    );
}