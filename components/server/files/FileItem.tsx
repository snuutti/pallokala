import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, getColors } from "@/constants/Colors";
import { ServerFile } from "@/types/file";

type FileItemProps = {
    file: ServerFile;
};

export default function FileItem(props: FileItemProps) {
    const colorScheme = useColorScheme();

    const colors = getColors(colorScheme);
    const style = styling(colors);

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

    return (
        <TouchableOpacity style={style.file}>
            <MaterialCommunityIcons name={getIcon()} size={30} color={colors.text} style={style.icon} />

            <View style={style.infoView}>
                <Text style={style.name}>{props.file.name}</Text>

                {props.file.isFile && (
                    <Text style={style.size}>{formatFileSize()}</Text>
                )}
            </View>

            <View style={style.actionsView}>
                {props.file.isFile ? (
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="download" size={30} color={colors.text} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="archive-arrow-down" size={30} color={colors.text} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity>
                    <MaterialCommunityIcons name="trash-can" size={30} color={colors.text} style={style.delete} />
                </TouchableOpacity>
            </View>
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
        delete: {
            marginLeft: 10
        }
    });
}