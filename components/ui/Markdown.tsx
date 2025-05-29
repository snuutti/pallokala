import { Fragment } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { useMarkdown } from "react-native-marked";
import { useStyle } from "@/hooks/useStyle";

export type MarkdownProps = {
    text: string;
};

export default function Markdown(props: MarkdownProps) {
    const { style, colors } = useStyle(() =>
        StyleSheet.create({
            em: {
                fontStyle: "normal"
            },
            link: {
                fontStyle: "normal"
            },
            codespan: {
                fontStyle: "normal",
                fontWeight: "normal"
            }
        })
    );
    const colorScheme = useColorScheme();
    const elements = useMarkdown(props.text, {
        colorScheme,
        styles: style,
        theme: {
            colors: {
                code: colors.codeBackground,
                link: colors.primary,
                text: colors.text,
                border: colors.textDisabled
            }
        }
    });

    return elements.map((element, index) => {
        return <Fragment key={index}>{element}</Fragment>;
    });
}