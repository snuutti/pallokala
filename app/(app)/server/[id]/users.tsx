import { useState, useEffect, useCallback } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import UsersListItem from "@/components/users/UsersListItem";
import NoUsers from "@/components/server/users/NoUsers";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useServer } from "@/context/ServerProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";

export default function UsersScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle(() =>
        StyleSheet.create({
            usersContainer: {
                paddingTop: 5,
                paddingBottom: 20
            }
        })
    );
    const { server } = useServer();
    const { fabVisible, onScroll } = useFabVisible();
    const { showSuccessAlert } = useToast();
    const { createPromptModal } = useModal();
    const users = useBoundStore(state => state.serverUsers[server!.id]);
    const setUsers = useBoundStore(state => state.setServerUsers);
    const [refreshing, setRefreshing] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = useCallback(async () => {
        setRefreshing(true);

        const users = await server!.getUsers();
        users.sort((a, b) => a.email.localeCompare(b.email));
        setUsers(server!.id, users);

        setRefreshing(false);
    }, []);

    const createAlert = () => {
        createPromptModal(
            t("servers:InviteUser"),
            {
                placeholder: t("users:Email"),
                inputType: "email-address"
            },
            [
                {
                    text: t("servers:InviteUser"),
                    icon: "plus",
                    style: "success",
                    onPress: inviteUser
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const inviteUser = async (email: string) => {
        setRefreshing(true);

        const newUser = {
            email,
            scopes: []
        };

        await server?.updateUser(newUser);
        router.push(`/(modal)/edituser?email=${email}`);

        showSuccessAlert(t("users:UserInvited"));

        await loadUsers();
    };

    return (
        <>
            <FlashList
                data={users}
                keyExtractor={user => user.email}
                renderItem={({ item }) => <UsersListItem user={item} />}
                contentContainerStyle={style.usersContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadUsers} />
                }
                onScroll={onScroll}
                ListEmptyComponent={NoUsers}
            />

            {server?.hasScope("server.users.create") && (
                <FloatingActionButton visible={fabVisible} onPress={createAlert}>
                    <MaterialCommunityIcons name="plus" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}