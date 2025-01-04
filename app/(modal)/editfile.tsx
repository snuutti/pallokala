import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, usePreventRemove } from "@react-navigation/core";
import { Image } from "expo-image";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { getType, skipDownload } from "@/utils/files";
import editorHtml from "@/constants/editorHtml";
import * as pako from "pako";
import { ApiClient } from "pufferpanel";

async function getFile(client: ApiClient, url: string): Promise<ArrayBuffer> {
    const res = await client.get(url, undefined, undefined, { responseType: "arraybuffer" });
    return res.data;
}

export default function EditFileScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: colors.background
            }
        })
    );
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { server, openFile, fileContent, setFileContent, isOriginalFileContent, setFileContentInitial, forceReadOnly } = useServer();
    const { createAlertModal } = useModal();
    const navigation = useNavigation();

    useEffect(() => {
        setFileContentInitial(null, false);

        if (skipDownload(openFile!)) {
            return;
        }

        getFile(apiClient!, server!.getFileUrl(openFile!.path)).then(res => {
            const data = new Uint8Array(res);
            let content = new TextDecoder("utf-8").decode(data);
            let readOnly = false;

            if (openFile?.name.endsWith(".log.gz")) {
                try {
                    content = pako.ungzip(data, { to: "string" });
                    readOnly = true;
                } catch (e) {
                    console.error("Failed to ungzip log file", e);
                }
            }

            setFileContentInitial(content, readOnly);
        });
    }, [openFile]);

    usePreventRemove(!isOriginalFileContent, ({ data }) => {
        createAlertModal(
            "Unsaved Changes",
            "You have unsaved changes. Are you sure you want to leave?",
            [
                {
                    text: "Leave",
                    icon: "check",
                    style: "danger",
                    onPress: () => {
                        navigation.dispatch(data.action);
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    });

    if (!openFile || (fileContent === null && !skipDownload(openFile))) {
        return <LoadingScreen />;
    }

    if (getType(openFile) === "image") {
        return (
            <Image
                source={{
                    uri: `${activeAccount!.serverAddress}${server?.getFileUrl(openFile?.path)}`,
                    headers: apiClient!._enhanceHeaders()
                }}
                style={style.container}
                contentFit="contain"
            />
        );
    }

    return (
        <WebView
            style={style.container}
            scrollEnabled={false}
            source={{ html: editorHtml }}
            injectedJavaScriptObject={{
                content: fileContent,
                name: openFile.name,
                readOnly: forceReadOnly || !server?.hasScope("server.files.edit")
            }}
            onMessage={(event) => {
                setFileContent(event.nativeEvent.data);
            }}
        />
    );
}