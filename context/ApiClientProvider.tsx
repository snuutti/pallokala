import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import UnifiedSessionStore from "@/utils/sessionStore";
import MockApiClient from "@/utils/mockApiClient";
import { getPanelVersion } from "@/utils/version";
import { getPrivateInfoReplacer } from "@/utils/json";
import { ApiClient, EditableConfigSettings, ErrorHandlerResult } from "pufferpanel";

type ApiClientContextType = {
    apiClient?: ApiClient;
    config?: EditableConfigSettings;
    sessionTimedOut: boolean;
    version: string | null;
    changeServer: (url: string) => ApiClient;
};

export const ApiClientContext = createContext<ApiClientContextType | undefined>(undefined);

type ApiClientProviderProps = {
    children: ReactNode;
};

export const ApiClientProvider = ({ children }: ApiClientProviderProps) => {
    const { t } = useTranslation();
    const { createAlertModal } = useModal();
    const { showErrorAlert } = useToast();
    const [apiClient, setApiClient] = useState<ApiClient | undefined>(undefined);
    const [config, setConfig] = useState<EditableConfigSettings | undefined>(undefined);
    const [sessionTimedOut, setSessionTimedOut] = useState(false);
    const [version, setVersion] = useState<string | null>(null);

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
        let newApiClient: ApiClient;
        if (url === "http://pallokala.test") {
            newApiClient = new MockApiClient(url, new UnifiedSessionStore());
            setVersion("100.0.0");
        } else {
            newApiClient = new ApiClient(url, new UnifiedSessionStore(), handleError);

            setVersion(null);
            getPanelVersion(url)
                .then(version => {
                    setVersion(version);
                })
                .catch(error => {
                    console.log("Failed to get panel version", error);
                    setVersion("unknown");
                    showErrorAlert("Failed to get panel version. Some features may be unavailable.");
                });
        }

        setConfig(undefined);
        setApiClient(newApiClient);
        setSessionTimedOut(false);

        return newApiClient;
    };

    const handleError = useCallback(async (error: ErrorHandlerResult) => {
        if (error.status === 401) {
            setSessionTimedOut(true);
            showErrorAlert(t("errors:ErrSessionTimedOut"));
        } else if (error.code === "ErrGeneric" && error.msg) {
            showErrorAlert(t(error.msg));
        } else if (error.code === "ErrUnknownError") {
            showErrorAlert(t("errors:ErrUnknownError"), undefined, {
                onPress: () => showErrorDetails(error)
            });
        } else {
            showErrorAlert(t("errors:" + error.code));
        }
    }, [apiClient]);

    const showErrorDetails = (error: ErrorHandlerResult) => {
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
            try {
                body = JSON.stringify(JSON.parse(body), getPrivateInfoReplacer(), 2);
            } catch (e) { }
        }

        const details = `${statusMessage}\n\nEndpoint: ${error.request.method} ${error.request.url}\n\n${body ? "Request Body: " + body : ""}`;

        createAlertModal(
            t("common:ErrorDetails"),
            details,
            [
                { text: t("common:Close") }
            ],
            {
                selectable: true
            }
        );
    };

    return (
        <ApiClientContext.Provider value={{ apiClient, config, sessionTimedOut, version, changeServer }}>
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