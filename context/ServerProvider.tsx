import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useToast } from "@/context/ToastProvider";
import { Server } from "pufferpanel";
import { ExtendedFileDesc } from "@/types/server";

type ServerContextType = {
    server?: Server;
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
    const { showSuccess } = useToast();
    const [server, setServer] = useState<Server | undefined>(undefined);
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
            setServer(undefined);
        };
    }, []);

    useEffect(() => {
        console.log("Account changed, closing socket");

        server?.closeSocket();

        setId(undefined);
        setServer(undefined);
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
        }

        console.log("Switching to server", id);
        setServer(undefined);
        apiClient!.server.get(id)
            .then((server) => setServer(server as Server))
            .catch((e) => {
                console.error("Error switching server", e);
                setError(true);
            });
    };

    return (
        <ServerContext.Provider value={{ server, id, error, openFile, setOpenFile, fileContent, setFileContent, isOriginalFileContent, setFileContentInitial, forceReadOnly, saveFile, switchServer }}>
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