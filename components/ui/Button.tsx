import { ComponentProps } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type ButtonProps = {
    text: string;
    icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
    style?: "default" | "danger" | "success";
    onPress: () => void;
    disabled?: boolean;
};

export default function Button(props: ButtonProps) {
    const { style, colors } = useStyle(styling);

    return (
        <TouchableOpacity
            style={[
                style.button,
                props.style === "danger" && style.danger,
                props.style === "success" && style.success
            ]}
            onPress={props.onPress}
            disabled={props.disabled}
        >
            {props.icon && (
                <MaterialCommunityIcons
                    name={props.icon}
                    size={30}
                    color={colors.textPrimary}
                    style={style.icon}
                />
            )}

            <Text style={style.text}>{props.text}</Text>
        </TouchableOpacity>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        button: {
            width: "100%",
            height: 48,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 5,
            backgroundColor: colors.primary,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },
        danger: {
            backgroundColor: colors.error
        },
        success: {
            backgroundColor: colors.success
        },
        icon: {
            marginRight: 10
        },
        text: {
            color: colors.textPrimary,
            textAlign: "center"
        }
    });
}