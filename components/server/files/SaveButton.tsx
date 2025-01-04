import { TouchableOpacity } from "react-native";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useServer } from "@/context/ServerProvider";
import { useColors } from "@/hooks/useStyle";

export default function SaveButton() {
    const colors = useColors();
    const { server, fileContent, forceReadOnly, saveFile } = useServer();

    if (fileContent === null || forceReadOnly || !server?.hasScope("server.files.edit")) {
        return null;
    }

    return (
        <TouchableOpacity onPress={saveFile}>
            <NavigationIcon name="content-save" color={colors.text} />
        </TouchableOpacity>
    );
}