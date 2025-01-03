import { useState, useEffect, useCallback } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import UsersListItem from "@/components/users/UsersListItem";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";
import { User } from "pufferpanel";

export default function UsersScreen() {
    const insets = useSafeAreaInsets();
    const { style, colors } = useStyle(() =>
        StyleSheet.create({
            usersContainer: {
                paddingTop: 5,
                paddingBottom: insets.bottom
            }
        })
    );
    const { apiClient } = useApiClient();
    const { fabVisible, onScroll } = useFabVisible();
    const users = useBoundStore(state => state.users);
    const setUsers = useBoundStore(state => state.setUsers);
    const [refreshing, setRefreshing] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = useCallback(async () => {
        setRefreshing(true);

        const newUsers: User[] = [];
        let page = 1;
        let allLoaded = false;

        do
        {
            const data = await apiClient!.user.list(page);
            newUsers.push(...data.users);

            page++;
            allLoaded = data.paging.page * data.paging.maxSize >= (data.paging.total || 0);
        }
        while (!allLoaded);

        setUsers(newUsers);

        setRefreshing(false);
    }, []);

    return (
        <>
            <FlashList
                data={users}
                keyExtractor={user => String(user.id)}
                renderItem={({ item }) => <UsersListItem user={item} />}
                estimatedItemSize={83}
                contentContainerStyle={style.usersContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadUsers} />
                }
                onScroll={onScroll}
            />

            {apiClient?.auth.hasScope("users.info.edit") && (
                <FloatingActionButton visible={fabVisible} onPress={() => router.push("/(modal)/createuser")} safeArea={true}>
                    <MaterialCommunityIcons name="plus" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}