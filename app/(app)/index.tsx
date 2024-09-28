import { useCallback, useState } from "react";
import { RefreshControl, FlatList, StyleSheet } from "react-native";
import ServerListItem from "@/components/ServerListItem";
import { Server } from "@/types/server";

const servers: Server[] = [
    {
        id: "6466c4b0",
        name: "test",
        node: {
            id: 0,
            name: "LocalNode",
            publicHost: "localhost",
            publicPort: 8080,
            sftpPort: 5657,
            isLocal: true
        },
        ip: "0.0.0.0",
        port: 25565,
        type: "minecraft-java",
        icon: "minecraft-java",
        canGetStatus: true
    },
    {
        id: "12345678",
        name: "test 2",
        node: {
            id: 0,
            name: "LocalNode",
            publicHost: "localhost",
            publicPort: 8080,
            sftpPort: 5657,
            isLocal: true
        },
        ip: "0.0.0.0",
        port: 25565,
        type: "minecraft-java",
        icon: "minecraft-java",
        canGetStatus: true
    }
];

export default function ServersScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const style = styling();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <FlatList
            data={servers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <ServerListItem server={item} />
            )}
            contentContainerStyle={style.serversContainer}
            style={style.servers}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    );
}

function styling() {
    return StyleSheet.create({
        serversContainer: {
            gap: 10
        },
        servers: {
            marginVertical: 10
        }
    });
}