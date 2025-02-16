import { useState, useEffect, useCallback } from "react";
import { RefreshControl, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ReactNativeBlobUtil from "react-native-blob-util";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BackupListItem from "@/components/server/backups/BackupListItem";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useApiClient } from "@/context/ApiClientProvider";
import { useServer } from "@/context/ServerProvider";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import { useStyle } from "@/hooks/useStyle";
import { Backup } from "pufferpanel";

export default function BackupsScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            backupsContainer: {
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
    const { activeAccount } = useAccount();
    const { server } = useServer();
    const { fabVisible, onScroll } = useFabVisible();
    const { showSuccessAlert } = useToast();
    const { createAlertModal, createPromptModal } = useModal();
    const [backups, setBackups] = useState<Backup[]>([]);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [refreshing, setRefreshing] = useState(true);

    const canRestore = server?.hasScope("server.backup.restore") || false;
    const canDelete = server?.hasScope("server.backup.delete") || false;

    useEffect(() => {
        loadBackups();
    }, []);

    const loadBackups = useCallback(async () => {
        setRefreshing(true);

        const backups = await server!.getBackups();
        backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setBackups(backups);

        setRefreshing(false);
    }, []);

    const restoreAlert = (backup: Backup) => {
        createAlertModal(
            t("backup:RestorePrompt"),
            t("backup:RestorePromptBody"),
            [
                {
                    text: t("backup:Restore"),
                    icon: "restore",
                    style: "danger",
                    onPress: () => restoreConfirm(backup)
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const restoreConfirm = async (backup: Backup) => {
        setRefreshing(true);

        try {
            await server?.restoreBackup(backup.id);
            showSuccessAlert(t("backup:RestoreStarted"));
            await loadBackups();
        } finally {
            setRefreshing(false);
        }
    };

    const deleteAlert = (backup: Backup) => {
        createAlertModal(
            t("backup:DeletePrompt"),
            t("backup:DeletePromptBody"),
            [
                {
                    text: t("backup:Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: () => deleteConfirm(backup)
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const deleteConfirm = async (backup: Backup) => {
        setRefreshing(true);

        try {
            await server?.deleteBackup(backup.id);
            showSuccessAlert(t("backup:Deleted"));
            await loadBackups();
        } finally {
            setRefreshing(false);
        }
    };

    const onDownload = async (backup: Backup) => {
        const filePath = server!.getBackupUrl(backup.id);
        const url = activeAccount!.serverAddress + filePath;

        showSuccessAlert(t("app:Servers.DownloadNotification"));
        await ReactNativeBlobUtil
            .config({
                addAndroidDownloads: {
                    useDownloadManager: true,
                    title: backup.name,
                    mediaScannable: true,
                    storeInDownloads: true,
                    notification: true
                }
            })
            .fetch("GET", url, apiClient!._enhanceHeaders());
    };

    const createAlert = () => {
        createPromptModal(
            t("backup:Create"),
            {
                placeholder: t("backup:Name"),
                inputType: "default"
            },
            [
                {
                    text: t("backup:Create"),
                    icon: "plus",
                    style: "success",
                    onPress: createBackup
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const createBackup = async (name: string) => {
        setRefreshing(true);
        setIsBackingUp(true);

        try {
            await server!.createBackup(name);
            showSuccessAlert(t("backup:BackupStarted"));

            await loadBackups();
        } finally {
            setIsBackingUp(false);
        }
    };

    return (
        <>
            <FlashList
                data={backups}
                keyExtractor={backup => String(backup.id)}
                renderItem={({ item }) => (
                    <BackupListItem
                        backup={item}
                        isBackingUp={isBackingUp}
                        canRestore={canRestore}
                        canDelete={canDelete}
                        onRestore={restoreAlert}
                        onDownload={onDownload}
                        onDelete={deleteAlert}
                    />
                )}
                estimatedItemSize={65}
                contentContainerStyle={style.backupsContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadBackups} />
                }
                onScroll={onScroll}
                ListEmptyComponent={<Text style={style.emptyText}>No backups</Text>}
            />

            {server?.hasScope("server.backup.create") && (
                <FloatingActionButton visible={fabVisible && !isBackingUp} onPress={createAlert}>
                    <MaterialCommunityIcons name="plus" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}