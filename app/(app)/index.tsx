import { useState, useEffect, useCallback } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ServerListItem from "@/components/server/ServerListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import useDisclaimer from "@/hooks/useDisclaimer";
import { useBoundStore } from "@/stores/useBoundStore";
import { ExtendedServerStatus, ExtendedServerView } from "@/types/server";
import { ServerView } from "pufferpanel";

export default function ServersScreen() {
    const { apiClient } = useApiClient();
    const servers = useBoundStore(state => state.servers);
    const setServers = useBoundStore(state => state.setServers);
    const setServerStatus = useBoundStore(state => state.setServerStatus);
    const [refreshing, setRefreshing] = useState(true);

    const style = styling();

    useEffect(() => {
        loadPage();
    }, []);

    useEffect(() => {
        const interval = setInterval(updateServerStatuses, 5000);
        return () => clearInterval(interval);
    }, [servers]);

    useDisclaimer();

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

        for (const server of servers) {
            if (!server.canGetStatus) {
                continue;
            }

            try {
                const online = await apiClient!.server.getStatus(server.id!);
                setServerStatus(server.id!, online);
            } catch {
                setServerStatus(server.id!, undefined);
            }
        }
    }, [servers]);

    return (
        <FlashList
            data={servers}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
                <ServerListItem server={item} />
            )}
            estimatedItemSize={85}
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
            paddingTop: 5,
            paddingBottom: 20
        }
    });
}