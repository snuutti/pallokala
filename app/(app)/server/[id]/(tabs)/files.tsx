import { useCallback, useState, useEffect } from "react";
import { Alert, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";
import FileItem from "@/components/server/files/FileItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
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
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { server, setOpenFile } = useServer();
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
            router.push(`../(modal)/editfile`);
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
        Alert.alert(
            "Delete File",
            `Are you sure you want to delete ${file.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteConfirm(file) }
            ],
            {
                cancelable: true
            }
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

    return (
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
        />
    );
}