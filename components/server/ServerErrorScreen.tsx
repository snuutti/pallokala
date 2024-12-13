import { Text, StyleSheet } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import { useStyle } from "@/hooks/useStyle";

export default function ServerErrorScreen() {
    const headerHeight = useHeaderHeight();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            contentContainer: {
                justifyContent: "center",
                marginBottom: headerHeight
            },
            header: {
                color: colors.text,
                fontSize: 32
            }
        })
    );

    return (
        <ContentWrapper contentContainerStyle={style.contentContainer}>
            <MaterialCommunityIcons name="alert" size={30} color={colors.text} />

            <Text style={style.header}>Failed to load server</Text>
        </ContentWrapper>
    );
}