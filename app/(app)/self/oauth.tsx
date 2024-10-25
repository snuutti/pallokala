import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import OAuthClientListItem from "@/components/self/OAuthClientListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { OAuthClient } from "pufferpanel";

export default function OAuthScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { createAlertModal, createPromptModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<OAuthClient[]>([]);

    useEffect(() => {
        refreshClients();
    }, []);

    const refreshClients = useCallback(async () => {
        setLoading(true);
        setClients(await apiClient?.self.getOAuthClients() || []);
        setLoading(false);
    }, [apiClient]);

    const openDocs = async () => {
        await WebBrowser.openBrowserAsync(`${activeAccount!.serverAddress}/swagger/index.html`);
    };

    const deleteAlert = (client: OAuthClient) => {
        createAlertModal(
            "Delete OAuth2 Client",
            `Are you sure you want to delete the OAuth2 Client "${client.name || "Unnamed OAuth2 Client"}"?`,
            [
                {
                    text: "Delete",
                    icon: "trash-can",
                    style: "danger",
                    onPress: () => deleteClient(client)
                },
                { text: "Cancel" }
            ]
        );
    };

    const deleteClient = async (client: OAuthClient) => {
        setLoading(true);
        await apiClient?.self.deleteOAuthClient(client.client_id);
        await refreshClients();
    };

    const createAlert = () => {
        createPromptModal(
            "Create new OAuth2 Client",
            "Name",
            "default",
            [
                {
                    text: "Next",
                    onPress: (name) => {
                        createPromptModal(
                            "Create new OAuth2 Client",
                            "Description",
                            "default",
                            [
                                {
                                    text: "Create new OAuth2 Client",
                                    icon: "content-save",
                                    onPress: (description) => createClient(name, description)
                                },
                                { text: "Cancel" }
                            ]
                        );
                    }
                },
                { text: "Cancel" }
            ]
        );
    };

    const createClient = async (name: string, description: string) => {
        setLoading(true);
        const client = await apiClient?.self.createOAuthClient(name, description);
        await refreshClients();

        // TODO: copy to clipboard
        createAlertModal(
            "OAuth2 Client Credentials",
            `Client ID: ${client!.client_id}\nClient Secret: ${client!.client_secret}`,
            [{ text: "Ok" }]
        );
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.text}>The OAuth2 Clients listed here inherit all of your accounts permissions</Text>

            <TouchableOpacity onPress={openDocs}>
                <Text style={style.link}>Find API documentation here</Text>
            </TouchableOpacity>

            <View style={style.clients}>
                {clients.map(client => (
                    <OAuthClientListItem key={client.client_id} client={client} onDelete={deleteAlert} />
                ))}
            </View>

            <Button
                text="Create new OAuth2 Client"
                icon="plus"
                onPress={createAlert}
            />
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        text: {
            color: colors.text
        },
        link: {
            color: colors.primary
        },
        clients: {
            marginVertical: 20,
            gap: 5
        }
    });
}