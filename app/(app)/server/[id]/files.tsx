import { useCallback, useState, useEffect } from "react";
import { RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ReactNativeBlobUtil from "react-native-blob-util";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import UploadProgressModal, { UploadFile, UploadState } from "@/components/server/files/UploadProgressModal";
import FileItem from "@/components/server/files/FileItem";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FloatingActionButton, { useFabVisible } from "@/components/ui/FloatingActionButton";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
import useLocalizedFormatter from "@/hooks/useLocalizedFormatter";
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
    const { server, fileManager, setOpenFile, setFileContent } = useServer();
    const { fabVisible, setFabVisible, onScroll } = useFabVisible();
    const { showSuccess } = useToast();
    const { createAlertModal, createPromptModal, createListModal, createModal } = useModal();
    const { formatFileSize } = useLocalizedFormatter();
    const [files, setFiles] = useState<FileDesc[]>([]);
    const [currentPath, setCurrentPath] = useState<FileDesc[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();

    const canEdit = server?.hasScope("server.files.edit") || false;

    useEffect(() => {
        if (server === undefined) {
            return;
        }

        refresh();
    }, [server, fileManager]);

    useBackHandler(() => {
        if (!isFocused) {
            return false;
        }

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

        const res = await fileManager!.ls(getCurrentPath());
        setFiles(res.sort(sortFiles));

        setRefreshing(false);
    }, [fileManager, getCurrentPath]);

    const openFile = useCallback(async (file: FileDesc) => {
        setRefreshing(true);

        if (file.isFile) {
            const openFile: ExtendedFileDesc = {
                ...file,
                path: getCurrentPath() + "/" + file.name
            };

            if (file.size! >= 30 * Math.pow(2, 20)) {
                createAlertModal(
                    t("files:OpenLargeFile"),
                    "",
                    [
                        {
                            text: t("files:OpenAnyways"),
                            icon: "check",
                            onPress: () => editFile(openFile)
                        },
                        {
                            text: t("common:Cancel"),
                            icon: "close",
                            style: "danger"
                        }
                    ]
                );
            } else {
                editFile(openFile);
            }
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

            const res = await fileManager!.ls(pathString);
            setFiles(res.sort(sortFiles));
            setFabVisible(true);
        }

        setRefreshing(false);
    }, [fileManager, getCurrentPath, currentPath]);

    const openFileDetails = useCallback((file: FileDesc) => {
        if (!file.isFile) {
            return;
        }

        const openFile: ExtendedFileDesc = {
            ...file,
            path: getCurrentPath() + "/" + file.name
        };

        setOpenFile(openFile);
        router.push("/(modal)/filedetails");
    }, [server, getCurrentPath, currentPath]);

    const navigateTo = useCallback(async (index: number) => {
        setRefreshing(true);

        const newPath = currentPath.slice(0, index + 1);
        setCurrentPath(newPath);

        const pathString = newPath.map(e => e.name).join("/");
        const res = await fileManager!.ls(pathString);
        setFiles(res.sort(sortFiles));
        setFabVisible(true);
        setRefreshing(false);
    }, [fileManager, currentPath]);

    const editFile = (file: ExtendedFileDesc) => {
        setOpenFile(file);
        setFileContent(null);
        router.push("/(modal)/editfile");
    };

    const onDownload = async (file: FileDesc) => {
        const filePath = server!.getFileUrl(getCurrentPath() + "/" + file.name);
        const url = activeAccount!.serverAddress + filePath;

        showSuccess("Check notifications for download progress");
        await ReactNativeBlobUtil
            .config({
                addAndroidDownloads: {
                    useDownloadManager: true,
                    title: file.name,
                    mediaScannable: true,
                    storeInDownloads: true,
                    notification: true
                }
            })
            .fetch("GET", url, apiClient!._enhanceHeaders());
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
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
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

    const onUploadFile = async (file: UploadFile, onUploadProgress: (sent: number, total: number) => void) => {
        let path = file.path;
        if (path.indexOf("/") === 0) {
            path = path.substring(1);
        }

        const url = activeAccount!.serverAddress + server!.getFileUrl(path);

        await ReactNativeBlobUtil
            .fetch("PUT", url, apiClient!._enhanceHeaders(), ReactNativeBlobUtil.wrap(file.uri))
            .uploadProgress(onUploadProgress)
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
            {
                onClose: async () => await refresh(),
                closable: false
            }
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

    const viewFolderDetails = () => {
        const folderCount = files.filter(f => !f.isFile && f.name !== "..").length;
        const fileCount = files.filter(f => f.isFile).length;
        const totalSize = files.filter(f => f.isFile)
            .reduce((acc, f) => acc + (f.size || 0), 0);

        createAlertModal(
            "Folder details",
            `Path: /${getCurrentPath()}\nFiles: ${fileCount}\nFolders: ${folderCount}\nTotal size: ${formatFileSize(totalSize)}`,
            [
                {
                    text: t("common:Close"),
                    icon: "close"
                }
            ]
        );
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
                            {
                                placeholder: t("common:Name"),
                                inputType: "default"
                            },
                            [
                                {
                                    text: t("files:CreateFile"),
                                    icon: "file-plus",
                                    style: "success",
                                    onPress: createFile
                                },
                                {
                                    text: t("common:Cancel"),
                                    icon: "close"
                                }
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
                            {
                                placeholder: t("common:Name"),
                                inputType: "default"
                            },
                            [
                                {
                                    text: t("files:CreateFolder"),
                                    icon: "folder-plus",
                                    style: "success",
                                    onPress: createFolder
                                },
                                {
                                    text: t("common:Cancel"),
                                    icon: "close"
                                }
                            ]
                        );
                    }
                },
                {
                    text: "View folder details",
                    icon: "folder-information",
                    onPress: viewFolderDetails
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
                        openFileDetails={openFileDetails}
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
                ListHeaderComponent={
                    <Breadcrumb
                        path={currentPath.map(e => e.name)}
                        onNavigate={navigateTo}
                    />
                }
            />

            {canEdit && (
                <FloatingActionButton visible={fabVisible} onPress={openMenu}>
                    <MaterialCommunityIcons name="dots-vertical" size={30} color={colors.textPrimary} />
                </FloatingActionButton>
            )}
        </>
    );
}