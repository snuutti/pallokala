import { useState, useEffect, useCallback } from "react";
import { RefreshControl, FlatList, StyleSheet } from "react-native";
import ServerListItem from "@/components/server/ServerListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { ExtendedServerStatus, ExtendedServerView } from "@/types/server";
import { ServerView } from "pufferpanel";

export default function ServersScreen() {
    const { apiClient } = useApiClient();
    const [servers, setServers] = useState<ExtendedServerView[]>([]);
    const [refreshing, setRefreshing] = useState(true);

    const style = styling();

    useEffect(() => {
        loadPage();
    }, []);

    useEffect(() => {
        const interval = setInterval(updateServerStatuses, 5000);
        return () => clearInterval(interval);
    }, [servers]);

    const loadPage = useCallback(async () => {
        setRefreshing(true);

        const newServers: ServerView[] = [];
        let page = 1;
        let allLoaded = false;

        do
        {
            const data = await apiClient!.server.list(page);
            newServers.push(...data.servers);

            page++;
            allLoaded = data.paging.page * data.paging.maxSize >= (data.paging.total || 0);
        }
        while (!allLoaded);

        await addServers(newServers);

        setRefreshing(false);

        async function addServers(newServers: ServerView[]) {
            const newServerViews: ExtendedServerView[] = await Promise.all(newServers.map(async server => {
                let online: ExtendedServerStatus = undefined;

                if (server.canGetStatus) {
                    try {
                        online = await apiClient!.server.getStatus(server.id!);
                    } catch {
                        online = undefined;
                    }
                }

                return {
                    ...server,
                    online
                };
            }));

            setServers(newServerViews);
        }
    }, [servers]);

    const updateServerStatuses = useCallback(async () => {
        if (servers.length === 0) {
            return;
        }

        const updatedServers = await Promise.all(servers.map(async (server) => {
            let online: ExtendedServerStatus = undefined;

            if (server.canGetStatus) {
                try {
                    online = await apiClient!.server.getStatus(server.id!);
                } catch {
                    online = undefined;
                }
            }

            return { ...server, online };
        }));

        setServers(updatedServers);
    }, [servers]);

    return (
        <FlatList
            data={servers}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
                <ServerListItem server={item} />
            )}
            contentContainerStyle={style.serversContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={loadPage} />
            }
        />
    );
}

function styling() {
    return StyleSheet.create({
        serversContainer: {
            paddingTop: 10,
            paddingBottom: 20,
            gap: 10
        }
    });
}