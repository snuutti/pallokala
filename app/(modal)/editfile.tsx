import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { WebView } from "react-native-webview";
import LoadingScreen from "@/components/screen/LoadingScreen";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
import { useStyle } from "@/hooks/useStyle";
import { getType, skipDownload } from "@/utils/files";

export default function EditFileScreen() {
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
    const { server, openFile, fileContent, setFileContent } = useServer();

    useEffect(() => {
        setFileContent(null);

        if (skipDownload(openFile!)) {
            return;
        }

        server?.getFile(openFile?.path, true).then(res => setFileContent(res as string));
    }, [openFile]);

    if (!openFile || (fileContent === null && !skipDownload(openFile))) {
        return <LoadingScreen />;
    }

    if (getType(openFile) === "image") {
        return (
            <Image
                source={{
                    uri: `${activeAccount!.serverAddress}${server?.getFileUrl(openFile?.path)}`,
                    headers: {
                        "Authorization": `Bearer ${apiClient!.auth.getToken()}`
                    }
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
            source={require("@/assets/editor/editor.html")}
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