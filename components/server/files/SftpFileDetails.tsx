import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { useModal } from "@/context/ModalProvider";
import useLocalizedFormatter from "@/hooks/useLocalizedFormatter";
import useFilePermissions from "@/hooks/useFilePermissions";
import { useStyle } from "@/hooks/useStyle";
import { SftpFileDesc, FileManager } from "@/utils/fileManager";
import { ExtendedFileDesc } from "@/types/server";

type SftpFileDetailsProps = {
    openFile: SftpFileDesc;
    fileManager: FileManager;
};

export default function SftpFileDetails(props: SftpFileDetailsProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            property: {
                flexDirection: "row"
            },
            propertyName: {
                flex: 1,
                flexGrow: 1,
                color: colors.text,
                fontWeight: "bold"
            },
            propertyText: {
                flex: 1,
                flexShrink: 1,
                color: colors.text
            },
            lastProperty: {
                marginBottom: 10
            }
        })
    );
    const { createPromptModal } = useModal();
    const { formatDateTime } = useLocalizedFormatter();
    const permissions = useFilePermissions(props.openFile.permissions);

    const renameFile = () => {
        createPromptModal(
            "Rename File",
            {
                defaultValue: props.openFile.name,
                placeholder: "New Name",
                inputType: "default"
            },
            [
                {
                    text: "Save",
                    icon: "content-save",
                    style: "success",
                    onPress: async (newName: string) => {
                        const oldPath = (props.openFile as ExtendedFileDesc).path;
                        const newPath = oldPath.substring(0, oldPath.lastIndexOf("/") + 1) + newName;

                        await props.fileManager.rename(oldPath, newPath);
                        router.back();
                        // TODO: refresh file list
                    }
                },
                {
                    text: "Cancel",
                    icon: "close",
                    style: "danger"
                }
            ]
        );
    };

    return (
        <>
            <View style={style.property}>
                <Text style={style.propertyName}>Last Accessed</Text>
                <Text selectable={true} style={style.propertyText}>
                    {formatDateTime(props.openFile.lastAccess)}
                </Text>
            </View>

            <View style={[style.property, style.lastProperty]}>
                <Text style={style.propertyName}>Permissions</Text>
                <Text selectable={true} style={style.propertyText}>
                    {permissions}
                </Text>
            </View>

            <Button
                text="Rename"
                icon="pencil"
                onPress={renameFile}
            />
        </>
    );
}