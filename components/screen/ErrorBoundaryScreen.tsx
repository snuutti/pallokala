import { Text, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { ErrorBoundaryProps } from "expo-router";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";

export default function ErrorBoundaryScreen({ error, retry }: ErrorBoundaryProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            scrollView: {
                backgroundColor: colors.backdrop
            },
            contentContainer: {
                justifyContent: "center"
            },
            header: {
                color: colors.text,
                fontSize: 32
            },
            subheader: {
                color: colors.text,
                fontSize: 16,
                marginBottom: 5
            }
        })
    );

    const copyError = async () => {
        await Clipboard.setStringAsync(error.stack!);
    };

    const openIssue = async () => {
        await Linking.openURL("https://github.com/snuutti/pallokala/issues/new/choose");
    };

    return (
        <ContentWrapper scrollViewStyle={style.scrollView} contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>An error has occurred</Text>
            <Text style={style.subheader}>{error.message}</Text>

            {error.stack && (
                <Button text="Copy Stack Trace" icon="content-copy" onPress={copyError} />
            )}

            <Button text="Report Issue" icon="bug" onPress={openIssue} />

            <Button text="Retry" icon="refresh" onPress={retry} />
        </ContentWrapper>
    );
}