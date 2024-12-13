import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import OAuthClientListItem from "@/components/self/OAuthClientListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { OAuthClient } from "pufferpanel";

export default function OAuthScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
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
        })
    );
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
            t("oauth:Delete"),
            t("oauth:ConfirmDelete", { name: client.name || t("oauth:UnnamedClient") }),
            [
                {
                    text: t("oauth:Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: () => deleteClient(client)
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
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
            t("oauth:Create"),
            t("common:Name"),
            "default",
            [
                {
                    text: t("common:Next"),
                    icon: "check",
                    onPress: (name) => {
                        createPromptModal(
                            t("oauth:Create"),
                            t("common:Description"),
                            "default",
                            [
                                {
                                    text: t("oauth:Create"),
                                    icon: "content-save",
                                    onPress: (description) => createClient(name, description)
                                },
                                {
                                    text: t("common:Cancel"),
                                    icon: "close"
                                }
                            ]
                        );
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const createClient = async (name: string, description: string) => {
        setLoading(true);
        const client = await apiClient?.self.createOAuthClient(name, description);
        await refreshClients();

        router.push(`/(modal)/oauthcreds?id=${client!.client_id}&secret=${client!.client_secret}`);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.text}>{t("oauth:AccountDescription")}</Text>

            <TouchableOpacity onPress={openDocs}>
                <Text style={style.link}>{t("oauth:Docs")}</Text>
            </TouchableOpacity>

            <View style={style.clients}>
                {clients.map(client => (
                    <OAuthClientListItem key={client.client_id} client={client} onDelete={deleteAlert} />
                ))}
            </View>

            <Button
                text={t("oauth:Create")}
                icon="plus"
                onPress={createAlert}
            />
        </ContentWrapper>
    );
}