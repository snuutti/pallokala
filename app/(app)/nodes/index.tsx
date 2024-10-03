import { useState, useEffect, useCallback } from "react";
import { RefreshControl, FlatList, StyleSheet } from "react-native";
import NodeListItem from "@/components/nodes/NodeListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { Node } from "pufferpanel";

export default function NodesScreen() {
    const { apiClient } = useApiClient();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [refreshing, setRefreshing] = useState(true);

    const style = styling();

    useEffect(() => {
        loadNodes();
    }, []);

    const loadNodes = useCallback(async () => {
        setRefreshing(true);
        setNodes(await apiClient!.node.list());
        setRefreshing(false);
    }, []);

    return (
        <FlatList
            data={nodes}
            keyExtractor={node => String(node.id)}
            renderItem={({ item }) => <NodeListItem node={item} />}
            contentContainerStyle={style.nodesContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={loadNodes} />
            }
        />
    );
}

function styling() {
    return StyleSheet.create({
        nodesContainer: {
            paddingTop: 10,
            paddingBottom: 20,
            gap: 10
        }
    });
}