import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ApiClient, EditableConfigSettings, InMemorySessionStore } from "pufferpanel";

type ApiClientContextType = {
    apiClient?: ApiClient;
    config?: EditableConfigSettings;
    changeServer: (url: string) => ApiClient;
};

export const ApiClientContext = createContext<ApiClientContextType | undefined>(undefined);

type ApiClientProviderProps = {
    children: ReactNode;
};

export const ApiClientProvider = ({ children }: ApiClientProviderProps) => {
    const [apiClient, setApiClient] = useState<ApiClient | undefined>(undefined);
    const [config, setConfig] = useState<EditableConfigSettings | undefined>(undefined);

    useEffect(() => {
        if (apiClient === undefined) {
            return;
        }

        apiClient
            .getConfig()
            .then(config => {
                setConfig(config);
            })
            .catch(error => {
                console.log(error);
                setConfig({
                    branding: {
                        name: "PufferPanel"
                    },
                    themes: {
                        active: "PufferPanel",
                        available: ["PufferPanel"],
                        settings: {}
                    },
                    registrationEnabled: true
                });
            })
    }, [apiClient]);

    const changeServer = (url: string): ApiClient => {
        const newApiClient = new ApiClient(url, new InMemorySessionStore());

        setConfig(undefined);
        setApiClient(newApiClient);

        return newApiClient;
    };

    return (
        <ApiClientContext.Provider value={{ apiClient, config, changeServer }}>
            {children}
        </ApiClientContext.Provider>
    );
}

export const useApiClient = () => {
    const context = useContext(ApiClientContext);
    if (!context) {
        throw new Error("useApiClient must be used within an ApiClientProvider");
    }

    return context;
}