import { ComponentProps } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";

type AlertVariant = "success" | "info" | "warning" | "error";

type AlertProps = {
    variant: AlertVariant;
    text: string;
};

const alertIcon: Record<AlertVariant, ComponentProps<typeof MaterialCommunityIcons>["name"]> = {
    success: "check-circle-outline",
    info: "information-outline",
    warning: "alert-outline",
    error: "alert-outline"
};

export default function Alert(props: AlertProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            alert: {
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 10
            },
            content: {
                flexDirection: "row",
                alignItems: "center",
                padding: 10
            },
            icon: {
                marginRight: 10
            },
            text: {
                color: colors.text
            },
            stripe: {
                position: "absolute",
                height: 5,
                width: "100%",
                bottom: 0
            }
        })
    );

    const backgroundColor = () => {
        switch (props.variant) {
            case "success":
                return colors.successBg;
            case "info":
                return colors.infoBg;
            case "warning":
                return colors.warningBg;
            case "error":
                return colors.errorBg;
        }
    };

    const iconColor = () => {
        switch (props.variant) {
            case "success":
                return colors.success;
            case "info":
                return colors.info;
            case "warning":
                return colors.warning;
            case "error":
                return colors.error;
        }
    };

    return (
        <View style={[style.alert, { backgroundColor: backgroundColor() }]}>
            <View style={style.content}>
                <MaterialCommunityIcons
                    name={alertIcon[props.variant]}
                    size={30}
                    color={iconColor()}
                    style={style.icon}
                />

                <Text style={style.text}>{props.text}</Text>
            </View>

            <View style={[style.stripe, { backgroundColor: iconColor() }]} />
        </View>
    );
}