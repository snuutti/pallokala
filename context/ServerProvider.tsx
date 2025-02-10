import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useToast } from "@/context/ToastProvider";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { FileManager, HttpFileManager, SftpFileManager } from "@/utils/fileManager";
import { getSftpHost } from "@/utils/files";
import { ExtendedFileDesc } from "@/types/server";
import { EmailAccount } from "@/types/account";
import { Server } from "pufferpanel";

type ServerContextType = {
    server?: Server;
    fileManager?: FileManager;
    id?: string;
    error: boolean;
    openFile?: ExtendedFileDesc;
    setOpenFile: (file: ExtendedFileDesc) => void;
    fileContent: string | null;
    setFileContent: (content: string | null) => void;
    isOriginalFileContent: boolean;
    setFileContentInitial: (content: string | null, forceReadOnly: boolean) => void;
    forceReadOnly: boolean;
    saveFile: () => void;
    switchServer: (id: string) => void;
};

export const ServerContext = createContext<ServerContextType | undefined>(undefined);

type ServerProviderProps = {
    children: ReactNode;
};

export const ServerProvider = ({ children }: ServerProviderProps) => {
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { showSuccess, showError } = useToast();
    const sftpFileManager = useSettingsStore(state => state.sftpFileManager);
    const [server, setServer] = useState<Server | undefined>(undefined);
    const [fileManager, setFileManager] = useState<FileManager | undefined>(undefined);
    const [id, setId] = useState<string | undefined>(undefined);
    const [error, setError] = useState(false);
    const [openFile, setOpenFile] = useState<ExtendedFileDesc | undefined>(undefined);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [originalFileContent, setOriginalFileContent] = useState<string | null>(null);
    const [forceReadOnly, setForceReadOnly] = useState(false);

    useEffect(() => {
        return () => {
            console.log("ServerProvider unmounting, closing socket");
            server?.closeSocket();
            fileManager?.close?.();
            setServer(undefined);
        };
    }, []);

    useEffect(() => {
        console.log("Account changed, closing socket");

        server?.closeSocket();
        fileManager?.close?.();

        setId(undefined);
        setServer(undefined);
        setFileManager(undefined);
    }, [activeAccount]);

    const isOriginalFileContent = fileContent === originalFileContent;

    const setFileContentInitial = (content: string | null, forceReadOnly: boolean) => {
        setForceReadOnly(forceReadOnly);
        setFileContent(content);
        setOriginalFileContent(content);
    };

    const saveFile = async () => {
        await server?.uploadFile(openFile!.path, fileContent!);
        setOriginalFileContent(fileContent);
        showSuccess("File saved");
    };

    const switchServer = (id: string) => {
        setError(false);
        setId(id);

        if (server) {
            console.log("Already connected to a server, closing socket");
            server.closeSocket();
            fileManager?.close?.();
        }

        console.log("Switching to server", id);
        setServer(undefined);
        apiClient!.server.get(id)
            .then(async (s) => {
                const server = s as Server;
                setServer(server);

                await initFileManager(server);
            })
            .catch((e) => {
                console.error("Error switching server", e);
                setError(true);
            });
    };

    const initFileManager = async (server: Server) => {
        let fileManager: FileManager | undefined;

        if (sftpFileManager && activeAccount!.type === "email" && server.hasScope("server.sftp")) {
            try {
                const host = getSftpHost(server, activeAccount!);
                if (!host) {
                    throw new Error("SFTP host was undefined");
                }

                const emailAccount = activeAccount as EmailAccount;

                fileManager = new SftpFileManager();
                await (fileManager as SftpFileManager).connect({
                    host,
                    port: server.node.sftpPort!,
                    username: `${emailAccount.email}#${server.id}`,
                    password: emailAccount.password
                });
            } catch (e) {
                console.error("Failed to connect to SFTP", e);
                showError("Failed to connect to SFTP. Falling back to HTTP");
                fileManager = new HttpFileManager(server);
            }
        } else {
            fileManager = new HttpFileManager(server);
        }

        setFileManager(fileManager);
    };

    return (
        <ServerContext.Provider value={{ server, fileManager, id, error, openFile, setOpenFile, fileContent, setFileContent, isOriginalFileContent, setFileContentInitial, forceReadOnly, saveFile, switchServer }}>
            {children}
        </ServerContext.Provider>
    );
}

export const useServer = () => {
    const context = useContext(ServerContext);
    if (!context) {
        throw new Error("useServer must be used within a ServerProvider");
    }

    return context;
};