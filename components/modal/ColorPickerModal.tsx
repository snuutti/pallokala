import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ColorPicker, { HueSlider, Panel1 } from "reanimated-color-picker";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";

type ColorPickerModalProps = {
    title?: string;
    defaultColor?: string;
    onColorSelected?: (color: string) => void;
    handleClose?: () => void;
};

export default function ColorPickerModal(props: ColorPickerModalProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                justifyContent: "center",
                alignItems: "center"
            },
            title: {
                color: colors.text,
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10
            },
            colorPicker: {
                width: "100%"
            },
            panel1: {
                borderRadius: 16
            },
            slider: {
                borderRadius: 16,
                marginTop: 20,
                marginBottom: 15
            }
        })
    );
    const [hasSelected, setHasSelected] = useState(false);
    const [color, setColor] = useState(props.defaultColor || colors.primary);

    const onButtonPressed = () => {
        if (hasSelected) {
            return;
        }

        setHasSelected(true);
        props.onColorSelected?.(color);
        props.handleClose?.();
    };

    return (
        <View style={style.container}>
            {props.title && (
                <Text style={style.title}>{props.title}</Text>
            )}

            <ColorPicker
                value={color}
                onComplete={({ hex }) => setColor(hex)}
                sliderThickness={25}
                thumbSize={24}
                thumbShape="circle"
                boundedThumb={true}
                style={style.colorPicker}
            >
                <Panel1 style={style.panel1} />
                <HueSlider style={style.slider} />
            </ColorPicker>

            <Button
                text="Use color"
                onPress={onButtonPressed}
                disabled={hasSelected}
            />
        </View>
    );
}