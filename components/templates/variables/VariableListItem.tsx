import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";
import { Variable } from "pufferpanel";

type VariableListItemProps = {
    variable: Variable;
    canChangeGroup: boolean;
    edit: () => void;
};

export default function VariableListItem(props: VariableListItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            variable: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10
            },
            nameView: {
                flexGrow: 1,
                flexShrink: 1,
                flexDirection: "column",
                justifyContent: "center"
            },
            label: {
                color: colors.text
            },
            actionsView: {
                flexDirection: "row"
            },
            marginLeft: {
                marginLeft: 10
            }
        })
    );

    return (
        <View style={style.variable}>
            <TouchableOpacity onPress={props.edit} style={style.nameView}>
                <Text style={style.label}>{props.variable.display}</Text>
            </TouchableOpacity>

            <View style={style.actionsView}>
                {props.canChangeGroup && (
                    <TouchableOpacity>
                        <MaterialCommunityIcons
                            name="select-group"
                            size={30}
                            color={colors.text}
                            style={style.marginLeft}
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity>
                    <MaterialCommunityIcons
                        name="trash-can"
                        size={30}
                        color={colors.text}
                        style={style.marginLeft}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}