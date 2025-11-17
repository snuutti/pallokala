import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";
import { WebauthnCredentialView } from "pufferpanel";

type PasskeyListItemProps = {
    passkey: WebauthnCredentialView;
    onDelete: (passkeyId: string) => void;
};

export default function PasskeyListItem(props: PasskeyListItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            passkey: {
                flexDirection: "row",
                alignItems: "center"
            },
            infoView: {
                flexGrow: 1,
                flexShrink: 1,
                flexDirection: "column"
            },
            text: {
                color: colors.text
            }
        })
    );

    return (
        <View style={style.passkey}>
            <View style={style.infoView}>
                <Text style={style.text} numberOfLines={1}>{props.passkey.name}</Text>
            </View>

            <TouchableOpacity onPress={() => props.onDelete(props.passkey.id)}>
                <MaterialCommunityIcons name="trash-can" size={30} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
}