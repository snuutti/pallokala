import { useMemo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/core";
import * as DropdownMenu from "zeego/dropdown-menu";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useServer } from "@/context/ServerProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";

export default function DrawerHeaderButton() {
    const { style, colors } = useStyle(styling);
    const { server } = useServer();
    const { createPromptModal } = useModal();
    const route = useRoute();

    const showMenu = useMemo(() => {
        if (!server) {
            return false;
        }

        return server.hasScope("server.start")
            || server.hasScope("server.stop")
            || server.hasScope("server.kill")
            || server.hasScope("server.install")
            || server.hasScope("server.name.edit");
    }, [server]);

    const editServerName = () => {
        if (!server) {
            return;
        }

        createPromptModal(
            "Edit server name",
            "Name",
            "default",
            [
                {
                    text: "Save",
                    icon: "content-save",
                    style: "success",
                    onPress: async (name) => await server.updateName(name)
                },
                { text: "Cancel" }
            ]
        );
    };

    if (!server || route.name !== "server/[id]") {
        return (
            <TouchableOpacity style={style.searchIcon}>
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
                        <DropdownMenu.ItemTitle>Start</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.stop") && (
                    <DropdownMenu.Item key="stop" onSelect={() => server?.stop()}>
                        <DropdownMenu.ItemTitle>Stop</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.kill") && (
                    <DropdownMenu.Item key="kill" onSelect={() => server?.kill()}>
                        <DropdownMenu.ItemTitle>Kill</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.install") && (
                    <DropdownMenu.Item key="install" onSelect={() => server?.install()}>
                        <DropdownMenu.ItemTitle>Install</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}

                {server.hasScope("server.name.edit") && (
                    <DropdownMenu.Item key="name" onSelect={editServerName}>
                        <DropdownMenu.ItemTitle>Edit server name</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

function styling() {
    return StyleSheet.create({
        searchIcon: {
            marginHorizontal: 11
        }
    });
}