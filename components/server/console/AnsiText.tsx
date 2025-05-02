import { useMemo } from "react";
import { Text, type TextStyle } from "react-native";
import Anser from "anser";

type AnsiTextProps = {
    text: string;
    style: TextStyle;
};

export default function AnsiText(props: AnsiTextProps) {
    const parsedAnsi = useMemo<Anser.AnserJsonEntry[]>(
        () => Anser.ansiToJson(props.text),
        [props.text]
    );

    const applyStyle = (item: Anser.AnserJsonEntry): TextStyle => {
        const style: TextStyle = { ...props.style };
        let bold = false;
        let italic = false;

        if (item.fg) {
            style.color = `rgb(${item.fg})`;
        }

        if (item.bg) {
            style.backgroundColor = `rgb(${item.bg})`;
        }

        if (item.decorations.includes("bold")) {
            bold = true;
        }

        if (item.decorations.includes("dim")) {
            style.opacity = 0.5;
        }

        if (item.decorations.includes("underline")) {
            style.textDecorationLine = "underline";
        }

        if (item.decorations.includes("italic")) {
            italic = true;
        }

        if (bold && italic) {
            style.fontFamily = "UbuntuMonoBoldItalic";
        } else if (bold) {
            style.fontFamily = "UbuntuMonoBold";
        } else if (italic) {
            style.fontFamily = "UbuntuMonoItalic";
        }

        return style;
    };

    return parsedAnsi.map((item: Anser.AnserJsonEntry, index) => (
        <Text key={index} style={applyStyle(item)}>{item.content}</Text>
    ));
}