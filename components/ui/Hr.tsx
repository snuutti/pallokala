import { View, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";

export default function Hr() {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            hr: {
                borderBottomWidth: 1,
                borderBottomColor: colors.textDisabled,
                opacity: 0.3,
                marginVertical: 5
            }
        })
    );

    return <View style={style.hr} />;
}