import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useLocalizedFormatter from "@/hooks/useLocalizedFormatter";
import { useStyle } from "@/hooks/useStyle";
import { Backup } from "pufferpanel";

type BackupListItemProps = {
    backup: Backup;
    isBackingUp: boolean;
    canRestore: boolean;
    canDelete: boolean;
    onRestore: (backup: Backup) => void;
    onDownload: (backup: Backup) => void;
    onDelete: (backup: Backup) => void;
};

export default function BackupListItem(props: BackupListItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            backup: {
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
            date: {
                color: colors.textDisabled
            },
            actionsView: {
                flexDirection: "row",
                marginHorizontal: 10
            },
            restore: {
                marginRight: 10
            },
            delete: {
                marginLeft: 10
            },
            disabled: {
                opacity: 0.5
            }
        })
    );
    const { formatBackupDateTime } = useLocalizedFormatter();

    return (
        <View style={style.backup}>
            <MaterialCommunityIcons
                name="file"
                size={30}
                color={colors.text}
                style={style.icon}
            />

            <View style={style.infoView}>
                <Text style={style.name} numberOfLines={1}>
                    {props.backup.name}
                </Text>

                <Text style={style.date} numberOfLines={1}>
                    {formatBackupDateTime(new Date(props.backup.createdAt))}
                </Text>
            </View>

            <View style={style.actionsView}>
                {props.canRestore && (
                    <TouchableOpacity onPress={() => props.onRestore(props.backup)} disabled={props.isBackingUp}>
                        <MaterialCommunityIcons
                            name="restore"
                            size={30}
                            color={colors.text}
                            style={[style.restore, props.isBackingUp && style.disabled]}
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => props.onDownload(props.backup)} disabled={props.isBackingUp}>
                    <MaterialCommunityIcons
                        name="download"
                        size={30}
                        color={colors.text}
                        style={props.isBackingUp && style.disabled}
                    />
                </TouchableOpacity>

                {props.canDelete && (
                    <TouchableOpacity onPress={() => props.onDelete(props.backup)} disabled={props.isBackingUp}>
                        <MaterialCommunityIcons
                            name="trash-can"
                            size={30}
                            color={colors.text}
                            style={[style.delete, props.isBackingUp && style.disabled]}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}