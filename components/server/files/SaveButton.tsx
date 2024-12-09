import { TouchableOpacity } from "react-native";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useServer } from "@/context/ServerProvider";
import { useToast } from "@/context/ToastProvider";
import { useColors } from "@/hooks/useStyle";

export default function SaveButton() {
    const colors = useColors();
    const { server, openFile, fileContent } = useServer();
    const { showSuccess } = useToast();

    const saveFile = async () => {
        await server?.uploadFile(openFile!.path, fileContent!);
        showSuccess("File saved");
    };

    if (fileContent === null || !server?.hasScope("server.files.edit")) {
        return null;
    }

    return (
        <TouchableOpacity onPress={saveFile}>
            <NavigationIcon name="content-save" color={colors.text} />
        </TouchableOpacity>
    );
}