import { useCallback, useState, useEffect } from "react";
import { RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import UploadProgressModal, { UploadFile, UploadState } from "@/components/server/files/UploadProgressModal";
import FileItem from "@/components/server/files/FileItem";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useModal } from "@/context/ModalProvider";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
import { useColors } from "@/hooks/useStyle";
import useBackHandler from "@/hooks/useBackHandler";
import { ExtendedFileDesc } from "@/types/server";
import { FileDesc } from "pufferpanel";

function sortFiles(a: FileDesc, b: FileDesc) {
    if (a.isFile && !b.isFile) {
        return 1;
    }

    if (!a.isFile && b.isFile) {
        return -1;
    }

    if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
    }

    return 1;
}

export default function FilesScreen() {
    const { t } = useTranslation();
    const colors = useColors();
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { server, setOpenFile, setFileContent } = useServer();
    const { fabVisible, setFabVisible, onScroll } = useFabVisible();
    const { createAlertModal, createPromptModal, createListModal, createModal } = useModal();
    const [files, setFiles] = useState<FileDesc[]>([]);
    const [currentPath, setCurrentPath] = useState<FileDesc[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const canEdit = server?.hasScope("server.files.edit") || false;

    useEffect(() => {
        if (server === undefined) {
            return;
        }

        refresh();
    }, [server]);

    useBackHandler(() => {
        if (currentPath.length > 0) {
            openFile({ name: "..", isFile: false });
            return true;
        }

        return false;
    });

    const getCurrentPath = useCallback(() => {
        return currentPath.map(e => e.name).join("/");
    }, [currentPath]);

    const refresh = useCallback(async () => {
        setRefreshing(true);

        const res = await server?.getFile(getCurrentPath()) as FileDesc[];
        setFiles(res.sort(sortFiles));

        setRefreshing(false);
    }, [server, getCurrentPath]);

    const openFile = useCallback(async (file: FileDesc) => {
        setRefreshing(true);

        if (file.isFile) {
            // TODO: file size warn
            const openFile: ExtendedFileDesc = {
                ...file,
                path: getCurrentPath() + "/" + file.name
            };

            setOpenFile(openFile);
            setFileContent(null);
            router.push(`/(modal)/editfile`);
        } else {
            let pathString: string;
            if (file.name === "..") {
                const newPath = currentPath;
                newPath.pop();
                setCurrentPath(newPath);
                pathString = getCurrentPath();
            } else {
                setCurrentPath([...currentPath, file]);
                pathString = getCurrentPath() + "/" + file.name;
            }

            const res = await server?.getFile(pathString) as FileDesc[];
            setFiles(res.sort(sortFiles));
            setFabVisible(true);
        }

        setRefreshing(false);
    }, [server, getCurrentPath, currentPath]);

    const onDownload = async (file: FileDesc) => {
        const filePath = server!.getFileUrl(getCurrentPath() + "/" + file.name);
        const url = activeAccount!.serverAddress + filePath;

        const { uri } = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + file.name, {
            headers: {
                "Authorization": `Bearer ${apiClient!.auth.getToken()}`
            }
        });

        await Sharing.shareAsync(uri, {
            dialogTitle: "Select where to save the file"
        });
    };

    const deleteAlert = (file: FileDesc) => {
        createAlertModal(
            t("files:Delete"),
            t("files:ConfirmDelete", { name: file.name }),
            [
                {
                    text: t("files:Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: () => deleteConfirm(file)
                },
                { text: t("common:Cancel") }
            ]
        );
    };

    const deleteConfirm = async (file: FileDesc) => {
        setRefreshing(true);
        await server?.deleteFile(getCurrentPath() + "/" + file.name);
        await refresh();
    };

    const onArchive = async (file: FileDesc) => {
        setRefreshing(true);
        await server?.archiveFile(await makeArchiveName(file.name), `${getCurrentPath()}/${file.name}`);
        await refresh();
    };

    const makeArchiveName = async (fileName: string) => {
        let destination = `${getCurrentPath()}/${fileName}.zip`;
        for (let i = 2; await server?.fileExists(destination); i++) {
            destination = `${getCurrentPath()}/${fileName} (${i}).zip`;
        }

        return destination;
    };

    const onExtract = async (file: FileDesc) => {
        let dest = getCurrentPath();
        if (!dest.startsWith("/")) {
            dest = "/" + dest;
        }

        setRefreshing(true);
        await server?.extractFile(`${getCurrentPath()}/${file.name}`, dest);
        await refresh();
    };

    const archiveCurrentDirectory = async () => {
        const item = currentPath[currentPath.length - 1];
        let lastPathEntry = server?.id;
        if (item !== undefined) {
            lastPathEntry = currentPath[currentPath.length - 1].name;
        }

        setRefreshing(true);
        await server?.archiveFile(await makeArchiveName(lastPathEntry!), getCurrentPath());
        await refresh();
    };

    const onUploadFile = async (file: UploadFile, onUploadProgress: (event: ProgressEvent) => void) => {
        const blob = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64
        });

        await server?.uploadFile(file.path, blob, onUploadProgress);
    };

    const uploadFile = async () => {
        const files = await DocumentPicker.getDocumentAsync({ multiple: true });
        if (files.canceled) {
            return;
        }

        const newUploadState: UploadState = {
            total: files.assets.length,
            files: files.assets.map((file) => ({
                uri: file.uri,
                name: file.name,
                path: getCurrentPath() + "/" + file.name,
                size: file.size || 0,
                progress: 0
            }))
        };

        createModal(
            <UploadProgressModal
                state={newUploadState}
                uploadFile={onUploadFile}
            />,
            async () => await refresh(),
            false
        );
    };

    const createFile = async (name: string) => {
        if (name.trim() === "") {
            return;
        }

        await server?.uploadFile(getCurrentPath() + "/" + name, "");
        await openFile({ name, size: 0, isFile: true });
        await refresh();
    };

    const createFolder = async (name: string) => {
        if (name.trim() === "") {
            return;
        }

        await server?.createFolder(getCurrentPath() + "/" + name);
        await openFile({ name, isFile: false });
    };

    const openMenu = () => {
        createListModal(
            [
                {
                    text: t("files:ArchiveCurrent"),
                    icon: "archive-arrow-down",
                    onPress: archiveCurrentDirectory
                },
                {
                    text: t("files:UploadFile"),
                    icon: "file-upload",
                    onPress: uploadFile
                },
                {
                    text: t("files:CreateFile"),
                    icon: "file-plus",
                    onPress: () => {
                        createPromptModal(
                            t("files:CreateFile"),
                            t("common:Name"),
                            "default",
                            [
                                {
                                    text: t("files:CreateFile"),
                                    icon: "file-plus",
                                    style: "success",
                                    onPress: createFile
                                },
                                { text: t("common:Cancel") }
                            ]
                        );
                    }
                },
                {
                    text: t("files:CreateFolder"),
                    icon: "folder-plus",
                    onPress: () => {
                        createPromptModal(
                            t("files:CreateFolder"),
                            t("common:Name"),
                            "default",
                            [
                                {
                                    text: t("files:CreateFolder"),
                                    icon: "folder-plus",
                                    style: "success",
                                    onPress: createFolder
                                },
                                { text: t("common:Cancel") }
                            ]
                        );
                    }
                }
            ]
        );
    };

    return (
        <>
            <FlashList
                data={files}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <FileItem
                        file={item}
                        canEdit={canEdit}
                        onOpen={openFile}
                        onDownload={onDownload}
                        onDelete={deleteAlert}
                        onArchive={onArchive}
                        onExtract={onExtract}
                    />
                )}
                estimatedItemSize={58}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                }
                onScroll={onScroll}
            />

            {canEdit && (
                <FloatingActionButton visible={fabVisible} onPress={openMenu}>
                    <MaterialCommunityIcons name="dots-vertical" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}