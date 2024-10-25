import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { WebView } from "react-native-webview";
import LoadingScreen from "@/components/screen/LoadingScreen";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
import { useStyle } from "@/hooks/useStyle";
import { getType, skipDownload } from "@/utils/files";
import { Colors } from "@/constants/Colors";

export default function EditFileScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { server, openFile } = useServer();
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        setContent(null);

        if (skipDownload(openFile!)) {
            return;
        }

        server?.getFile(openFile?.path, true).then(res => setContent(res as string));
    }, [openFile]);

    if (!openFile || (content === null && !skipDownload(openFile))) {
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
                content,
                name: openFile.name,
                readOnly: !server?.hasScope("server.files.edit")
            }}
            onMessage={(event) => {
                setContent(event.nativeEvent.data);
            }}
        />
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background
        }
    });
}