import { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { OAuthAccount } from "@/types/account";
import { OAuthClient } from "pufferpanel";

type OAuthClientListItemProps = {
    client: OAuthClient;
    onDelete: (client: OAuthClient) => void;
};

export default function OAuthClientListItem(props: OAuthClientListItemProps) {
    const { activeAccount } = useAccount();
    const { style, colors } = useStyle(styling);

    const isCurrentClient = useCallback(() => {
        if (activeAccount?.type !== "oauth") {
            return false;
        }

        const oauthAccount = activeAccount as OAuthAccount;
        return oauthAccount.clientId === props.client.client_id;
    }, [activeAccount, props.client]);

    return (
        <View style={style.client}>
            <View style={style.infoView}>
                <Text style={style.text} numberOfLines={1}>{props.client.name || "Unnamed OAuth2 Client"}</Text>
                <Text style={style.text} numberOfLines={1}>{props.client.client_id}</Text>
            </View>

            {!isCurrentClient() && (
                <TouchableOpacity onPress={() => props.onDelete(props.client)}>
                    <MaterialCommunityIcons name="trash-can" size={30} color={colors.text} />
                </TouchableOpacity>
            )}
        </View>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        client: {
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
    });
}