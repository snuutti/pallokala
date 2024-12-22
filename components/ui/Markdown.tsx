import { StyleSheet } from "react-native";
import { default as MarkdownDisplay } from "react-native-markdown-display";
import { useStyle } from "@/hooks/useStyle";

export type MarkdownProps = {
    text: string;
};

export default function Markdown(props: MarkdownProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            heading1: {
                color: colors.text
            },
            heading2: {
                color: colors.text
            },
            heading3: {
                color: colors.text
            },
            heading4: {
                color: colors.text
            },
            heading5: {
                color: colors.text
            },
            heading6: {
                color: colors.text
            },
            bullet_list: {
                color: colors.text
            },
            ordered_list: {
                color: colors.text
            },
            paragraph: {
                color: colors.text
            },
            link: {
                color: colors.primary,
                textDecorationLine: "none"
            },
            code_inline: {
                backgroundColor: colors.background,
                borderColor: colors.textDisabled,
                color: colors.text,
                fontFamily: "UbuntuMono"
            },
            fence: {
                backgroundColor: colors.background,
                borderColor: colors.textDisabled,
                color: colors.text,
                fontFamily: "UbuntuMono"
            }
        })
    );

    return (
        <MarkdownDisplay style={style}>
            {props.text}
        </MarkdownDisplay>
    );
}