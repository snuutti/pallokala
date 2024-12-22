import { useState, useEffect, useCallback } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import NodeListItem from "@/components/nodes/NodeListItem";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useApiClient } from "@/context/ApiClientProvider";
import { useColors } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";

export default function NodesScreen() {
    const colors = useColors();
    const { apiClient } = useApiClient();
    const { fabVisible, onScroll } = useFabVisible();
    const nodes = useBoundStore(state => state.nodes);
    const setNodes = useBoundStore(state => state.setNodes);
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
        <>
            <FlashList
                data={nodes}
                keyExtractor={node => String(node.id)}
                renderItem={({ item }) => <NodeListItem node={item} />}
                estimatedItemSize={85}
                contentContainerStyle={style.nodesContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadNodes} />
                }
                onScroll={onScroll}
            />

            {apiClient?.auth.hasScope("nodes.create") && (
                <FloatingActionButton visible={fabVisible} onPress={() => router.push("/(modal)/createnode")} safeArea={true}>
                    <MaterialCommunityIcons name="plus" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}

function styling() {
    return StyleSheet.create({
        nodesContainer: {
            paddingTop: 5,
            paddingBottom: 20
        }
    });
}