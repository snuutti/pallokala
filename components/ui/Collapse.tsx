import { useState, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeOutUp, FadeInUp, LinearTransition } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";

export type CollapseProps = {
    title: string;
    children: ReactNode;
};

export default function Collapse(props: CollapseProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                marginVertical: 10
            },
            title: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            },
            text: {
                marginBottom: 10,
                color: colors.text,
                fontSize: 16
            }
        })
    );
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={style.container}>
            <TouchableOpacity style={style.title} onPress={() => setExpanded(!expanded)}>
                <Text style={style.text}>{props.title}</Text>

                <MaterialCommunityIcons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={30}
                    color={style.text.color}
                />
            </TouchableOpacity>

            {expanded && (
                <Animated.View
                    layout={LinearTransition}
                    exiting={FadeOutUp}
                    entering={FadeInUp}
                >
                    {props.children}
                </Animated.View>
            )}
        </View>
    );
}