import { Text, StyleSheet } from "react-native";
import { default as EUISlider, SliderProps as EUISliderProps } from "@expo/ui/community/slider";
import { useStyle } from "@/hooks/useStyle";

export type SliderProps = EUISliderProps & {
    label?: string;
    description?: string;
};

export default function Slider(props: SliderProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            label: {
                color: colors.text,
                marginHorizontal: 16,
                marginTop: 5,
                alignSelf: "flex-start"
            },
            slider: {
                marginVertical: 5
            },
            description: {
                color: colors.textDisabled,
                marginHorizontal: 16,
                marginBottom: 5,
                alignSelf: "flex-start"
            }
        })
    );

    return (
        <>
            {props.label && (
                <Text style={style.label}>{props.label}</Text>
            )}

            <EUISlider
                {...props}
                style={style.slider}
                thumbTintColor={colors.primary}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.primary}
            />

            {props.description && (
                <Text style={style.description}>{props.description}</Text>
            )}
        </>
    );
}