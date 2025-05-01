import { WebView, WebViewProps } from "react-native-webview";
import editorHtml from "@/constants/editorHtml";

type CodeEditorProps = WebViewProps & {
    content: string | null;
    fileName?: string;
    readonly?: boolean;
    onContentChange: (content: string) => void;
};

export default function CodeEditor(props: CodeEditorProps) {
    const injectedObject = {
        content: props.content || "",
        name: props.fileName,
        readOnly: props.readonly ?? false
    };

    return (
        <WebView
            {...props}
            scrollEnabled={false}
            source={{ html: editorHtml }}
            nestedScrollEnabled={true}
            injectedJavaScriptBeforeContentLoaded={`window.editorContent = ${JSON.stringify(injectedObject)};`}
            onMessage={(event) => {
                props.onContentChange(event.nativeEvent.data);
            }}
        />
    );
}