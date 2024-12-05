import { StyleSheet } from "react-native";
import { default as MarkdownDisplay } from "react-native-markdown-display";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type MarkdownProps = {
    text: string;
};

export default function Markdown(props: MarkdownProps) {
    const { style } = useStyle(styling);

    return (
        <MarkdownDisplay style={style}>
            {props.text}
        </MarkdownDisplay>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        heading2: {
            color: colors.text
        },
        heading3: {
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
    });
}