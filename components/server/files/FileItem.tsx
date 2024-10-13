import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useServer } from "@/context/ServerProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
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
    onOpen: (file: FileDesc) => void;
    onDownload: (file: FileDesc) => void;
    onDelete: (file: FileDesc) => void;
    onArchive: (file: FileDesc) => void;
    onExtract: (file: FileDesc) => void;
};

export default function FileItem(props: FileItemProps) {
    const { style, colors } = useStyle(styling);
    const { server } = useServer();

    const canEdit = server?.hasScope("server.files.edit");

    const getIcon = (): any => {
        if (!props.file.isFile) {
            return "folder";
        }

        if (!props.file.extension) {
            return "file";
        }

        const map: { [key: string]: string } = {
            ".txt": "file-document",
            ".json": "code-braces",
            ".log": "math-log",
            ".jar": "language-java",
            ".java": "language-java",
            ".js": "language-javascript",
            ".jsx": "language-javascript",
            ".ts": "language-typescript",
            ".tsx": "language-typescript",
            ".properties": "file-cog",
            ".lock": "file-lock",
            ".toml": "file-toml",
            ".zip": "zip-box",
            ".gz": "zip-box",
            ".csv": "file-table",
            ".yml": "file-cog",
            ".yaml": "file-cog",
            ".png": "file-image",
            ".jpg": "file-image",
            ".jpeg": "file-image"
        };

        return map[props.file.extension] || "file";
    };

    const formatFileSize = () => {
        const numFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

        if (!props.file.size) {
            return "0 B";
        }

        if (props.file.size < Math.pow(2, 10)) {
            return numFormat.format(props.file.size) + " B";
        }

        if (props.file.size < Math.pow(2, 20)) {
            return numFormat.format(props.file.size / Math.pow(2, 10)) + " KiB";
        }

        if (props.file.size < Math.pow(2, 30)) {
            return numFormat.format(props.file.size / Math.pow(2, 20)) + " MiB";
        }

        if (props.file.size < Math.pow(2, 40)) {
            return numFormat.format(props.file.size / Math.pow(2, 30)) + " GiB";
        }

        return numFormat.format(props.file.size / Math.pow(2, 40)) + " TiB";
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
        <TouchableOpacity style={style.file} onPress={() => props.onOpen(props.file)}>
            <MaterialCommunityIcons name={getIcon()} size={30} color={colors.text} style={style.icon} />

            <View style={style.infoView}>
                <Text style={style.name} numberOfLines={1}>{props.file.name}</Text>

                {props.file.isFile && (
                    <Text style={style.size} numberOfLines={1}>{formatFileSize()}</Text>
                )}
            </View>

            {props.file.name !== ".." && (
                <View style={style.actionsView}>
                    {(props.file.isFile && isArchive() && canEdit) && (
                        <TouchableOpacity onPress={() => props.onExtract(props.file)}>
                            <MaterialCommunityIcons name="archive-arrow-up" size={30} color={colors.text} style={style.extract} />
                        </TouchableOpacity>
                    )}

                    {props.file.isFile ? (
                        <TouchableOpacity onPress={() => props.onDownload(props.file)}>
                            <MaterialCommunityIcons name="download" size={30} color={colors.text} />
                        </TouchableOpacity>
                    ) : canEdit && (
                        <TouchableOpacity onPress={() => props.onArchive(props.file)}>
                            <MaterialCommunityIcons name="archive-arrow-down" size={30} color={colors.text} />
                        </TouchableOpacity>
                    )}

                    {canEdit && (
                        <TouchableOpacity onPress={() => props.onDelete(props.file)}>
                            <MaterialCommunityIcons name="trash-can" size={30} color={colors.text} style={style.delete} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
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
    });
}