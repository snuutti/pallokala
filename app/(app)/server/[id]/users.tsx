import { useState, useEffect, useCallback } from "react";
import { RefreshControl, FlatList, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import UsersListItem from "@/components/users/UsersListItem";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useServer } from "@/context/ServerProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { UserPermissionsView } from "pufferpanel";

export default function UsersScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            usersContainer: {
                paddingTop: 10,
                paddingBottom: 20,
                gap: 10
            },
            emptyText: {
                color: colors.text,
                textAlign: "center"
            }
        })
    );
    const { server } = useServer();
    const { fabVisible, onScroll } = useFabVisible();
    const { showSuccess } = useToast();
    const { createPromptModal } = useModal();
    const [users, setUsers] = useState<UserPermissionsView[]>([]);
    const [refreshing, setRefreshing] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = useCallback(async () => {
        setRefreshing(true);

        const users = await server!.getUsers();
        users.sort((a, b) => a.email.localeCompare(b.email));
        setUsers(users);

        setRefreshing(false);
    }, []);

    const createAlert = () => {
        createPromptModal(
            t("servers:InviteUser"),
            t("users:Email"),
            "email-address",
            [
                {
                    text: t("servers:InviteUser"),
                    icon: "plus",
                    style: "success",
                    onPress: inviteUser
                },
                { text: t("common:Cancel") }
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

        showSuccess(t("users.UserInvited"));

        await loadUsers();
    };

    return (
        <>
            <FlatList
                data={users}
                keyExtractor={user => user.email}
                renderItem={({ item }) => <UsersListItem user={item} />}
                contentContainerStyle={style.usersContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadUsers} />
                }
                onScroll={onScroll}
                ListEmptyComponent={<Text style={style.emptyText}>{t("servers:NoUsers")}</Text>}
            />

            {server?.hasScope("server.users.create") && (
                <FloatingActionButton visible={fabVisible} onPress={createAlert}>
                    <MaterialCommunityIcons name="plus" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}