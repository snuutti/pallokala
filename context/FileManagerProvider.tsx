import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react";
import { useServer } from "@/context/ServerProvider";
import { sortFiles } from "@/utils/files";
import { ExtendedFileDesc } from "@/types/server";
import { FileDesc } from "pufferpanel";

type FileManagerContextType = {
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    files: FileDesc[];
    currentPath: FileDesc[];
    getCurrentPath: () => string;
    setCurrentPath: (path: FileDesc[]) => void;
    refresh: () => Promise<void>;
    navigateTo: (index: number) => Promise<void>;
    navigateToPath: (path: string) => Promise<void>;
    isMovingFile: boolean;
    startMove: (file: ExtendedFileDesc) => void;
    cancelMove: () => void;
    moveFile: () => Promise<void>;
};

export const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

type FileManagerProviderProps = {
    children: ReactNode;
};

export const FileManagerProvider = ({ children }: FileManagerProviderProps) => {
    const { fileManager } = useServer();
    const [refreshing, setRefreshing] = useState(true);
    const [files, setFiles] = useState<FileDesc[]>([]);
    const [currentPath, setCurrentPath] = useState<FileDesc[]>([]);
    const [movingFile, setMovingFile] = useState<ExtendedFileDesc | null>(null);

    const getCurrentPath = useCallback(() => {
        return currentPath.map(e => e.name).join("/");
    }, [currentPath]);

    const refresh = useCallback(async () => {
        setRefreshing(true);

        const res = await fileManager!.ls(getCurrentPath());
        setFiles(res.sort(sortFiles));

        setRefreshing(false);
    }, [fileManager, getCurrentPath]);

    const navigateTo = useCallback(async (index: number) => {
        setRefreshing(true);

        const newPath = currentPath.slice(0, index + 1);
        setCurrentPath(newPath);

        const pathString = newPath.map(e => e.name).join("/");
        const res = await fileManager!.ls(pathString);
        setFiles(res.sort(sortFiles));
        setRefreshing(false);
    }, [fileManager, currentPath]);

    const navigateToPath = useCallback(async (path: string) => {
        setRefreshing(true);
        const res = await fileManager!.ls(path);
        setFiles(res.sort(sortFiles));
        setRefreshing(false);
    }, [fileManager]);

    const startMove = useCallback((file: ExtendedFileDesc) => {
        setMovingFile(file);
    }, []);

    const cancelMove = useCallback(() => {
        setMovingFile(null);
    }, []);

    const moveFile = useCallback(async () => {
        if (movingFile === null) {
            return;
        }

        const newPath = getCurrentPath() + "/" + movingFile.name;
        await fileManager!.rename(movingFile.path, newPath);
        await refresh();
        setMovingFile(null);
    }, [fileManager, movingFile, getCurrentPath, refresh]);

    const isMovingFile = useMemo(() => {
        return movingFile !== null;
    }, [movingFile]);

    return (
        <FileManagerContext.Provider
            value={{
                refreshing,
                setRefreshing,
                files,
                currentPath,
                getCurrentPath,
                setCurrentPath,
                refresh,
                navigateTo,
                navigateToPath,
                isMovingFile,
                startMove,
                cancelMove,
                moveFile
            }}
        >
            {children}
        </FileManagerContext.Provider>
    );
};

export const useFileManager = () => {
    const context = useContext(FileManagerContext);
    if (!context) {
        throw new Error("useFileManager must be used within a FileManagerProvider");
    }

    return context;
};