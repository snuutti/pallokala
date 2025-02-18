import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useServer } from "@/context/ServerProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import useCronSchedule from "@/hooks/useCronSchedule";
import { useBoundStore } from "@/stores/useBoundStore";
import { ServerTask } from "@/types/server";
import { ApiClient, ConditionalMetadataType } from "pufferpanel";

async function getServerTask(api: ApiClient, serverId: string, taskId: string) {
    const res = await api.get(`/api/servers/${serverId}/tasks/${taskId}`);
    return res.data as ServerTask;
}

async function editServerTask(api: ApiClient, serverId: string, taskId: string, data: ServerTask) {
    await api.put(`/api/servers/${serverId}/tasks/${taskId}`, data);
}

async function deleteServerTask(api: ApiClient, serverId: string, taskId: string) {
    await api.delete(`/api/servers/${serverId}/tasks/${taskId}`);
}

async function runServerTask(api: ApiClient, serverId: string, taskId: string) {
    await api.post(`/api/servers/${serverId}/tasks/${taskId}/run`);
}

export default function EditTaskScreen() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { server } = useServer();
    const { createAlertModal } = useModal();
    const { showSuccessAlert } = useToast();
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const modifyServerTask = useBoundStore(state => state.modifyServerTask);
    const removeServerTask = useBoundStore(state => state.removeServerTask);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cron, setCron] = useState("");
    const [operations, setOperations] = useState<ConditionalMetadataType[]>([]);
    const [loading, setLoading] = useState(true);
    const schedule = useCronSchedule(cron);

    const canEdit = server?.hasScope("server.tasks.edit") || false;

    useEffect(() => {
        getServerTask(apiClient!, server!.id, taskId).then(task => {
            setName(task.name);
            setDescription(task.description || "");
            setCron(task.cronSchedule);
            setOperations(task.operations || []);
            setLoading(false);
        });
    }, [server, taskId]);

    const saveTask = async () => {
        await editServerTask(apiClient!, server!.id, taskId, {
            name,
            description,
            cronSchedule: cron,
            operations
        });

        modifyServerTask(server!.id, taskId, { name, cronSchedule: cron, description });
        showSuccessAlert(t("app:Servers.Tasks.SaveSuccess"));
    };

    const runTask = async () => {
        await runServerTask(apiClient!, server!.id, taskId);
        showSuccessAlert(t("app:Servers.Tasks.RunSuccess"));
    };

    const deleteTask = () => {
        createAlertModal(
            t("app:Servers.Tasks.DeletePrompt"),
            t("app:Servers.Tasks.DeletePromptBody"),
            [
                {
                    text: t("app:Servers.Tasks.Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteConfirm
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const deleteConfirm = async () => {
        await deleteServerTask(apiClient!, server!.id, taskId);
        removeServerTask(server!.id, taskId);
        router.back();

        showSuccessAlert(t("app:Servers.Tasks.DeleteSuccess"));
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <TextInput
                value={taskId}
                placeholder={t("app:Servers.Tasks.Id")}
                editable={false}
            />

            <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t("app:Servers.Tasks.Name")}
                editable={canEdit}
            />

            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t("app:Servers.Tasks.Description")}
                editable={canEdit}
            />

            <TextInput
                value={cron}
                onChangeText={setCron}
                placeholder={t("app:Servers.Tasks.Cron")}
                description={schedule}
                error={schedule === undefined ? t("app:Servers.Tasks.CronInvalid") : undefined}
                editable={canEdit}
            />

            {canEdit && (
                <Button
                    text={t("common:Save")}
                    icon="content-save"
                    onPress={saveTask}
                />
            )}

            {server?.hasScope("server.tasks.run") && (
                <Button
                    text={t("app:Servers.Tasks.Run")}
                    icon="play-circle"
                    style="success"
                    onPress={runTask}
                />
            )}

            {server?.hasScope("server.tasks.delete") && (
                <Button
                    text={t("app:Servers.Tasks.Delete")}
                    icon="trash-can"
                    style="danger"
                    onPress={deleteTask}
                />
            )}
        </ContentWrapper>
    );
}