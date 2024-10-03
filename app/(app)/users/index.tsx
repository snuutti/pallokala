import { useState, useEffect, useCallback } from "react";
import { RefreshControl, FlatList, StyleSheet } from "react-native";
import UsersListItem from "@/components/users/UsersListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { User } from "pufferpanel";

export default function UsersScreen() {
    const { apiClient } = useApiClient();
    const [users, setUsers] = useState<User[]>([]);
    const [refreshing, setRefreshing] = useState(true);

    const style = styling();

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
        <FlatList
            data={users}
            keyExtractor={user => String(user.id)}
            renderItem={({ item }) => <UsersListItem user={item} />}
            contentContainerStyle={style.usersContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={loadUsers} />
            }
        />
    );
}

function styling() {
    return StyleSheet.create({
        usersContainer: {
            paddingTop: 10,
            paddingBottom: 20,
            gap: 10
        }
    });
}