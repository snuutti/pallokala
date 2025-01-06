import { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";

type StepProgressProps = {
    steps: ComponentProps<typeof MaterialCommunityIcons>["name"][];
    current: number;
};

export default function StepProgress(props: StepProgressProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: 20
            },
            line: {
                position: "absolute",
                left: 0,
                top: 24 / 2 + 1,
                height: 2
            },
            lineComplete: {
                backgroundColor: colors.primary
            },
            lineIncomplete: {
                right: 0,
                backgroundColor: colors.primaryHover
            },
            icon: {
                backgroundColor: colors.background,
                borderRadius: 50,
                padding: 2
            },
            completed: {
                backgroundColor: colors.primary
            }
        })
    );

    const positions = props.steps.map((_, index) => `${25 + index * 25}%`);

    return (
        <View style={style.container}>
            <View style={[style.line, style.lineComplete, { width: positions[props.current] }]} />
            <View style={[style.line, style.lineIncomplete]} />

            {props.steps.map((step, index) => (
                <MaterialCommunityIcons
                    key={index}
                    name={props.current > index ? "check" : step}
                    size={24}
                    color={props.current > index ? colors.textPrimary : colors.text}
                    style={[style.icon, props.current > index && style.completed]}
                />
            ))}
        </View>
    );
}