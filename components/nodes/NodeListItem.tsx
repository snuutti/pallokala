import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { Node } from "pufferpanel";

type NodeListItemProps = {
    node: Node;
};

export default function NodeListItem(props: NodeListItemProps) {
    const { style } = useStyle(styling);

    return (
        <TouchableOpacity style={style.node}>
            <Text style={style.name} numberOfLines={1}>{props.node.name}</Text>
            <Text style={style.address} numberOfLines={1}>{props.node.publicHost}:{props.node.publicPort}</Text>
        </TouchableOpacity>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        node: {
            height: 70,
            padding: 15,
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: colors.background,
            marginHorizontal: 10,
            borderRadius: 15
        },
        name: {
            color: colors.text
        },
        address: {
            color: colors.textDisabled
        }
    });
}