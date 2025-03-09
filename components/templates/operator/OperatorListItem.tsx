import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";
import { getOperatorLabel } from "@/utils/operators";
import { ConditionalMetadataType } from "pufferpanel";

type OperatorListItemProps = {
    operation: ConditionalMetadataType;
    canMoveUp: boolean;
    canMoveDown: boolean;
    edit: () => void;
    up: () => void;
    down: () => void;
    delete: () => void;
};

export default function OperatorListItem(props: OperatorListItemProps) {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            operation: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10
            },
            infoView: {
                flexGrow: 1,
                flexShrink: 1,
                flexDirection: "column",
                justifyContent: "center"
            },
            label: {
                color: colors.text
            },
            if: {
                color: colors.textDisabled
            },
            actionsView: {
                flexDirection: "row",
                marginLeft: 10
            },
            leftMargin: {
                marginLeft: 10
            },
            actionDisabled: {
                opacity: 0.4
            }
        })
    );

    return (
        <View style={style.operation}>
            <TouchableOpacity style={style.infoView} onPress={props.edit}>
                <Text style={style.label}>
                    {getOperatorLabel(t, props.operation)}
                </Text>

                {props.operation.if && (
                    <Text style={style.if}>
                        {props.operation.if}
                    </Text>
                )}
            </TouchableOpacity>

            <View style={style.actionsView}>
                <TouchableOpacity onPress={props.up} disabled={!props.canMoveUp}>
                    <MaterialCommunityIcons
                        name="chevron-up"
                        size={30}
                        color={colors.text}
                        style={!props.canMoveUp && style.actionDisabled}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={props.down} disabled={!props.canMoveDown}>
                    <MaterialCommunityIcons
                        name="chevron-down"
                        size={30}
                        color={colors.text}
                        style={[style.leftMargin, !props.canMoveDown && style.actionDisabled]}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={props.delete}>
                    <MaterialCommunityIcons
                        name="trash-can"
                        size={30}
                        color={colors.text}
                        style={style.leftMargin}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}