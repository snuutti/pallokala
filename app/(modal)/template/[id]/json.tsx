import { StyleSheet } from "react-native";
import { useDebouncedCallback } from "use-debounce";
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
    const { json, setTemplate } = useTemplateEditor();

    const onChange = useDebouncedCallback(
        (newJson: string) => {
            setTemplate((prev) => {
                try {
                    return { ...prev!, ...JSON.parse(newJson) };
                } catch {
                    return prev;
                }
            });
        },
        500
    );

    return (
        <CodeEditor
            style={style.codeEditor}
            content={json || null}
            fileName="template.json"
            onContentChange={onChange}
        />
    );
}