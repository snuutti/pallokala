import { Text, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
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

    return (
        <ContentWrapper scrollViewStyle={style.scrollView} contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>An error has occurred</Text>
            <Text style={style.subheader}>{error.message}</Text>

            {error.stack && (
                <Button text="Copy Stack Trace" icon="content-copy" onPress={copyError} />
            )}

            <Button text="Retry" icon="refresh" onPress={retry} />
        </ContentWrapper>
    );
}