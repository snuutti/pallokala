import { Text, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import { useServer } from "@/context/ServerProvider";
import useLocalizedFormatter from "@/hooks/useLocalizedFormatter";
import { useStyle } from "@/hooks/useStyle";
import { getIcon } from "@/utils/files";

export default function FileDetailsScreen() {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            icon: {
                alignSelf: "center"
            },
            name: {
                textAlign: "center",
                color: colors.text,
                fontSize: 20,
                paddingVertical: 10
            },
            property: {
                flexDirection: "row"
            },
            propertyName: {
                flex: 1,
                color: colors.text,
                fontWeight: "bold"
            },
            propertyText: {
                flexShrink: 1,
                color: colors.text
            }
        })
    );
    const { openFile } = useServer();
    const { formatFileSize, formatDateTime } = useLocalizedFormatter();

    if (!openFile) {
        return null;
    }

    return (
        <ContentWrapper>
            <MaterialCommunityIcons name={getIcon(openFile)} size={30} color={colors.text} style={style.icon} />

            <Text selectable={true} style={style.name}>{openFile.name}</Text>

            <View style={style.property}>
                <Text style={style.propertyName}>Size</Text>
                <Text selectable={true} style={style.propertyText}>
                    {formatFileSize(openFile.size)}
                </Text>
            </View>

            <View style={style.property}>
                <Text style={style.propertyName}>Last Modified</Text>
                <Text selectable={true} style={style.propertyText}>
                    {formatDateTime(openFile.modifyTime!)}
                </Text>
            </View>
        </ContentWrapper>
    );
}