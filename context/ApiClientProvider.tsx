import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Alert } from "react-native";
import { useToast } from "@/context/ToastProvider";
import { ApiClient, EditableConfigSettings, InMemorySessionStore, ErrorHandlerResult } from "pufferpanel";

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
    const { showError } = useToast();
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
                console.log("Failed to get config", error);
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
        const newApiClient = new ApiClient(url, new InMemorySessionStore(), handleError);

        setConfig(undefined);
        setApiClient(newApiClient);

        return newApiClient;
    };

    const handleError = useCallback(async (error: ErrorHandlerResult) => {
        if (error.status === 401) {
            // TODO: this probably doesn't work but i'm too lazy to test right now
            await apiClient?.auth.logout();
            showError("Session expired, please log in again");
        } else if (error.code === "ErrGeneric" && error.msg) {
            showError(error.msg);
        } else if (error.code === "ErrUnknownError") {
            showError("An unknown error occurred", () => showErrorDetails(error));
        } else {
            showError(error.code);
        }
    }, [apiClient]);

    const showErrorDetails = (error: ErrorHandlerResult) => {
        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key: string, value: any) => {
                if (key === "password") {
                    return "[password]";
                }

                if (typeof value === "string") {
                    try {
                        const json = JSON.parse(value);
                        if (typeof json === "object" && json !== null) {
                            if (Object.keys(json).indexOf("password") !== -1) {
                                json.password = "[password]";
                            }

                            return JSON.stringify(json);
                        } else {
                            return value;
                        }
                    } catch {
                        return value;
                    }
                }

                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }

                    seen.add(value);
                }

                return value;
            };
        };

        let statusMessage = `${error.status} ${error.statusText}`;
        switch (error.status) {
            case 401:
                statusMessage = "Not logged in (401)";
                break;
            case 403:
                statusMessage = "Permission denied (403)";
                break;
            case 404:
                statusMessage = "Endpoint not found, is something blocking access to the API? (404)";
                break;
            case 500:
                statusMessage = "Server error (500)";
                break;
            case 502:
                statusMessage = "Bad Gateway, is PufferPanel running? (502)";
                break;
        }

        let body = error.request.data;
        if (body) {
            body = JSON.stringify(JSON.parse(body), getCircularReplacer(), 2);
        }

        const details = `${statusMessage}\n\nEndpoint: ${error.request.method} ${error.request.url}\n\n${body ? "Request Body: " + body : ""}`;

        Alert.alert(
            "Error Details",
            details,
            [
                { text: "OK" }
            ],
            {
                cancelable: true
            }
        );
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