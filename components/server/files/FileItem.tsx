import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFileManager } from "@/context/FileManagerProvider";
import useLocalizedFormatter from "@/hooks/useLocalizedFormatter";
import { useStyle } from "@/hooks/useStyle";
import { getIcon } from "@/utils/files";
import { FileDesc } from "pufferpanel";

const archiveExtensions = [
    ".7z",
    ".bz2",
    ".gz",
    ".lz",
    ".lzma",
    ".rar",
    ".tar",
    ".tgz",
    ".xz",
    ".zip",
    ".zipx"
];

type FileItemProps = {
    file: FileDesc;
    canEdit: boolean;
    onOpen: (file: FileDesc) => void;
    openFileDetails: (file: FileDesc) => void;
    onDownload: (file: FileDesc) => void;
    onDelete: (file: FileDesc) => void;
    onArchive: (file: FileDesc) => void;
    onExtract: (file: FileDesc) => void;
};

export default function FileItem(props: FileItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            file: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10
            },
            icon: {
                marginHorizontal: 10
            },
            infoView: {
                flexGrow: 1,
                flexShrink: 1,
                flexDirection: "column",
                justifyContent: "center"
            },
            name: {
                color: colors.text
            },
            size: {
                color: colors.textDisabled
            },
            actionsView: {
                flexDirection: "row",
                marginHorizontal: 10
            },
            extract: {
                marginRight: 10
            },
            delete: {
                marginLeft: 10
            }
        })
    );
    const { isMovingFile } = useFileManager();
    const { formatFileSize, formatDateTime } = useLocalizedFormatter();

    const formatModifiedDate = () => {
        if (!props.file.modifyTime) {
            return null;
        }

        return " • " + formatDateTime(props.file.modifyTime);
    };

    const isArchive = (): boolean => {
        const filename = props.file.name.toLowerCase();
        for (let i = 0; i < archiveExtensions.length; i++) {
            if (filename.endsWith(archiveExtensions[i])) {
                return true;
            }
        }

        return false;
    };

    return (
        <TouchableOpacity
            style={style.file}
            onPress={() => props.onOpen(props.file)}
            onLongPress={() => props.openFileDetails(props.file)}
            disabled={isMovingFile && props.file.isFile}
        >
            <MaterialCommunityIcons name={getIcon(props.file)} size={30} color={colors.text} style={style.icon} />

            <View style={style.infoView}>
                <Text style={style.name} numberOfLines={1}>{props.file.name}</Text>

                {props.file.isFile && (
                    <Text style={style.size} numberOfLines={1}>{formatFileSize(props.file.size)}{formatModifiedDate()}</Text>
                )}
            </View>

            {(props.file.name !== ".." && !isMovingFile) && (
                <View style={style.actionsView}>
                    {(props.file.isFile && isArchive() && props.canEdit) && (
                        <TouchableOpacity onPress={() => props.onExtract(props.file)}>
                            <MaterialCommunityIcons name="archive-arrow-up" size={30} color={colors.text} style={style.extract} />
                        </TouchableOpacity>
                    )}

                    {props.file.isFile ? (
                        <TouchableOpacity onPress={() => props.onDownload(props.file)}>
                            <MaterialCommunityIcons name="download" size={30} color={colors.text} />
                        </TouchableOpacity>
                    ) : props.canEdit && (
                        <TouchableOpacity onPress={() => props.onArchive(props.file)}>
                            <MaterialCommunityIcons name="archive-arrow-down" size={30} color={colors.text} />
                        </TouchableOpacity>
                    )}

                    {props.canEdit && (
                        <TouchableOpacity onPress={() => props.onDelete(props.file)}>
                            <MaterialCommunityIcons name="trash-can" size={30} color={colors.text} style={style.delete} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}