import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useStyle } from "@/hooks/useStyle";
import { Node } from "pufferpanel";

type NodeListItemProps = {
    node: Node;
};

export default function NodeListItem(props: NodeListItemProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            node: {
                height: 70,
                padding: 15,
                flexGrow: 1,
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: colors.background,
                marginHorizontal: 10,
                marginVertical: 5,
                borderRadius: 15,
                boxShadow: colors.raised
            },
            name: {
                color: colors.text
            },
            address: {
                color: colors.textDisabled
            }
        })
    );

    const onPress = () => {
        router.push(`/(app)/nodes/${props.node.id}`);
    };

    return (
        <TouchableOpacity style={style.node} onPress={onPress}>
            <Text style={style.name} numberOfLines={1}>{props.node.name}</Text>
            <Text style={style.address} numberOfLines={1}>{props.node.publicHost}:{props.node.publicPort}</Text>
        </TouchableOpacity>
    );
}