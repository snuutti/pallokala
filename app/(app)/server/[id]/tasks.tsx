import { useState, useEffect, useCallback } from "react";
import { RefreshControl, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ServerTaskItem from "@/components/server/tasks/ServerTaskItem";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useApiClient } from "@/context/ApiClientProvider";
import { useServer } from "@/context/ServerProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";
import { ServerTasks, ServerTask } from "@/types/server";
import { ApiClient } from "pufferpanel";

async function getServerTasks(api: ApiClient, serverId: string) {
    const res = await api.get(`/api/servers/${serverId}/tasks`);
    return res.data as ServerTasks;
}

async function editServerTask(api: ApiClient, serverId: string, taskId: string, data: ServerTask) {
    await api.put(`/api/servers/${serverId}/tasks/${taskId}`, data);
}

export default function TasksScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            tasksContainer: {
                paddingTop: 5,
                paddingBottom: 20
            },
            emptyText: {
                color: colors.text,
                textAlign: "center"
            }
        })
    );
    const { apiClient } = useApiClient();
    const { server } = useServer();
    const { fabVisible, onScroll } = useFabVisible();
    const { createPromptModal } = useModal();
    const tasks = useBoundStore(state => state.serverTasks[server!.id]);
    const setTasks = useBoundStore(state => state.setServerTasks);
    const [refreshing, setRefreshing] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = useCallback(async () => {
        setRefreshing(true);

        const res = await getServerTasks(apiClient!, server!.id);
        const tasks = Object.entries(res.tasks).map(([id, task]) => ({ ...task, id }));
        setTasks(server!.id, tasks);

        setRefreshing(false);
    }, []);

    const createAlert = () => {
        createPromptModal(
            t("app:Servers.Tasks.CreateTask"),
            {
                placeholder: t("app:Servers.Tasks.Id")
            },
            [
                {
                    text: t("app:Servers.Tasks.CreateTask"),
                    icon: "plus",
                    style: "success",
                    onPress: createTask
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const createTask = async (taskId: string) => {
        const newTask: ServerTask = {
            name: "",
            cronSchedule: "",
            description: "",
            operations: []
        };

        await editServerTask(apiClient!, server!.id, taskId, newTask);
        router.push(`/(modal)/edittask?taskId=${taskId}`);

        await loadTasks();
    };

    return (
        <>
            <FlashList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ServerTaskItem task={item} />}
                contentContainerStyle={style.tasksContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadTasks} />
                }
                onScroll={onScroll}
                ListEmptyComponent={<Text style={style.emptyText}>{t("app:Servers.Tasks.NoTasks")}</Text>}
            />

            {server?.hasScope("server.tasks.edit") && (
                <FloatingActionButton visible={fabVisible} onPress={createAlert}>
                    <MaterialCommunityIcons name="plus" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}