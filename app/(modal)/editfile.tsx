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
    const { server, openFile, fileContent, setFileContent, isOriginalFileContent, setFileContentInitial } = useServer();
    const { createAlertModal } = useModal();
    const navigation = useNavigation();

    useEffect(() => {
        setFileContentInitial(null);

        if (skipDownload(openFile!)) {
            return;
        }

        server?.getFile(openFile?.path, true).then(res => setFileContentInitial(res as string));
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
                readOnly: !server?.hasScope("server.files.edit")
            }}
            onMessage={(event) => {
                setFileContent(event.nativeEvent.data);
            }}
        />
    );
}