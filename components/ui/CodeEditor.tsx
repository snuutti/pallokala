import { WebView, WebViewProps } from "react-native-webview";
import editorHtml from "@/constants/editorHtml";

type CodeEditorProps = WebViewProps & {
    content: string | null;
    fileName?: string;
    readonly?: boolean;
    onContentChange: (content: string) => void;
};

export default function CodeEditor(props: CodeEditorProps) {
    return (
        <WebView
            {...props}
            scrollEnabled={false}
            source={{ html: editorHtml }}
            domStorageEnabled={true}
            injectedJavaScriptObject={{
                content: props.content || "",
                name: props.fileName,
                readOnly: props.readonly ?? false
            }}
            onMessage={(event) => {
                props.onContentChange(event.nativeEvent.data);
            }}
        />
    );
}