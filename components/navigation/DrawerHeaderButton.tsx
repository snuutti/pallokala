import { useMemo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import * as DropdownMenu from "zeego/dropdown-menu";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useServer } from "@/context/ServerProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";

export default function DrawerHeaderButton() {
    const { t } = useTranslation();
    const { style, colors } = useStyle(() =>
        StyleSheet.create({
            searchIcon: {
                marginHorizontal: 11
            }
        })
    );
    const { server, error } = useServer();
    const { createPromptModal } = useModal();
    const modifyServer = useBoundStore(state => state.modifyServer);
    const route = useRoute();

    const showMenu = useMemo(() => {
        if (!server || error) {
            return false;
        }

        return server.hasScope("server.start")
            || server.hasScope("server.stop")
            || server.hasScope("server.kill")
            || server.hasScope("server.install")
            || server.hasScope("server.name.edit");
    }, [server, error]);

    const editServerName = () => {
        if (!server) {
            return;
        }

        createPromptModal(
            t("servers:EditName"),
            {
                defaultValue: server.name,
                placeholder: t("servers:Name"),
                inputType: "default"
            },
            [
                {
                    text: t("common:Save"),
                    icon: "content-save",
                    style: "success",
                    onPress: updateServerName
                },
                {
                    text: t("common:Cancel"),
                    icon: "close",
                    style: "danger"
                }
            ]
        );
    };

    const updateServerName = async (name: string) => {
        await server!.updateName(name);
        modifyServer(server!.id!, { name });
    };

    if (!server || route.name !== "server/[id]") {
        return (
            <TouchableOpacity style={style.searchIcon} onPress={() => router.push("/(modal)/search")}>
                <NavigationIcon name="magnify" color={colors.text} />
            </TouchableOpacity>
        );
    }

    if (!showMenu) {
        return null;
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <TouchableOpacity style={style.searchIcon}>
                    <NavigationIcon name="dots-vertical" color={colors.text} />
                </TouchableOpacity>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                {server.hasScope("server.start") && (
                    <DropdownMenu.Item key="start" onSelect={() => server?.start()}>
                        <DropdownMenu.ItemTitle>{t("servers:Start")}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.stop") && (
                    <DropdownMenu.Item key="stop" onSelect={() => server?.stop()}>
                        <DropdownMenu.ItemTitle>{t("servers:Stop")}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.kill") && (
                    <DropdownMenu.Item key="kill" onSelect={() => server?.kill()}>
                        <DropdownMenu.ItemTitle>{t("servers:Kill")}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.install") && (
                    <DropdownMenu.Item key="install" onSelect={() => server?.install()}>
                        <DropdownMenu.ItemTitle>{t("servers:Install")}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.name.edit") && (
                    <DropdownMenu.Item key="name" onSelect={editServerName}>
                        <DropdownMenu.ItemTitle>{t("servers:EditName")}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}