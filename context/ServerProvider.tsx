import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useApiClient } from "@/context/ApiClientProvider";
import { Server } from "pufferpanel";
import { ExtendedFileDesc } from "@/types/server";

type ServerContextType = {
    server?: Server;
    id?: string;
    openFile?: ExtendedFileDesc;
    setOpenFile: (file: ExtendedFileDesc) => void;
    fileContent: string | null;
    setFileContent: (content: string | null) => void;
    switchServer: (id: string) => void;
};

export const ServerContext = createContext<ServerContextType | undefined>(undefined);

type ServerProviderProps = {
    children: ReactNode;
};

export const ServerProvider = ({ children }: ServerProviderProps) => {
    const { apiClient } = useApiClient();
    const [server, setServer] = useState<Server | undefined>(undefined);
    const [id, setId] = useState<string | undefined>(undefined);
    const [openFile, setOpenFile] = useState<ExtendedFileDesc | undefined>(undefined);
    const [fileContent, setFileContent] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            // TODO: make this happen when switching account
            console.log("ServerProvider unmounting, closing socket");
            server?.closeSocket();
            setServer(undefined);
        };
    }, []);

    const switchServer = (id: string) => {
        setId(id);

        if (server) {
            console.log("Already connected to a server, closing socket");
            server.closeSocket();
        }

        console.log("Switching to server", id);
        apiClient!.server.get(id)
            .then((server) => setServer(server as Server))
            .catch(console.error); // TODO: proper error handling
    };

    return (
        <ServerContext.Provider value={{ server, id, openFile, setOpenFile, fileContent, setFileContent, switchServer }}>
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