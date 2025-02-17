import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import { useFileManager } from "@/context/FileManagerProvider";
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
    const { t } = useTranslation();
    const { refresh, startMove } = useFileManager();
    const { createPromptModal } = useModal();
    const { formatDateTime } = useLocalizedFormatter();
    const permissions = useFilePermissions(props.openFile.permissions);

    const renameFile = () => {
        createPromptModal(
            t("app:Servers.Files.RenameFile"),
            {
                defaultValue: props.openFile.name,
                placeholder: t("common:Name"),
                inputType: "default"
            },
            [
                {
                    text: t("common:Save"),
                    icon: "content-save",
                    style: "success",
                    onPress: async (newName: string) => {
                        const oldPath = (props.openFile as ExtendedFileDesc).path;
                        const newPath = oldPath.substring(0, oldPath.lastIndexOf("/") + 1) + newName;

                        await props.fileManager.rename(oldPath, newPath);
                        router.back();
                        await refresh();
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close",
                    style: "danger"
                }
            ]
        );
    };

    const moveFile = () => {
        startMove(props.openFile as ExtendedFileDesc);
        router.back();
    };

    return (
        <>
            <View style={style.property}>
                <Text style={style.propertyName}>{t("app:Servers.Files.LastAccessed")}</Text>
                <Text selectable={true} style={style.propertyText}>
                    {formatDateTime(props.openFile.lastAccess)}
                </Text>
            </View>

            <View style={[style.property, style.lastProperty]}>
                <Text style={style.propertyName}>{t("app:Servers.Files.Permissions")}</Text>
                <Text selectable={true} style={style.propertyText}>
                    {permissions}
                </Text>
            </View>

            <Button
                text={t("app:Servers.Files.RenameFile")}
                icon="pencil"
                onPress={renameFile}
            />

            <Button
                text={t("app:Servers.Files.MoveFile")}
                icon="file-move"
                onPress={moveFile}
            />
        </>
    );
}