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

        if (item.fg) {
            style.color = `rgb(${item.fg})`;
        }

        if (item.bg) {
            style.backgroundColor = `rgb(${item.bg})`;
        }

        if (item.decorations.includes("bold")) {
            style.fontFamily = "UbuntuMonoBold";
        }

        if (item.decorations.includes("dim")) {
            style.opacity = 0.5;
        }

        if (item.decorations.includes("underline")) {
            style.textDecorationLine = "underline";
        }

        if (item.decorations.includes("italic")) {
            style.fontStyle = "italic";
        }

        return style;
    };

    return (
        <Text>
            {parsedAnsi.map((item: Anser.AnserJsonEntry, index) => (
                <Text key={index} style={applyStyle(item)}>{item.content}</Text>
            ))}
        </Text>
    );
}