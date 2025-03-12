import { StyleSheet } from "react-native";
import CodeEditor from "@/components/ui/CodeEditor";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";
import { useStyle } from "@/hooks/useStyle";

export default function JsonScreen() {
    const { style } = useStyle(() =>
        StyleSheet.create({
            codeEditor: {
                flex: 1
            }
        })
    );
    const { json } = useTemplateEditor();

    console.log(json);

    return (
        <CodeEditor
            style={style.codeEditor}
            content={json || null}
            fileName="template.json"
            onContentChange={() => {}}
        />
    );
}