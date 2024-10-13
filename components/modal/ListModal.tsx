import { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

type ListModalProps = {
    items: ModalButton[];
    handleClose?: () => void;
};

export default function ListModal(props: ListModalProps) {
    const { style, colors } = useStyle(styling);
    const [hasSelected, setHasSelected] = useState(false);

    const onSelection = (item: ModalButton) => {
        if (hasSelected) {
            return;
        }

        setHasSelected(true);
        item.onPress?.();
        props.handleClose!();
    };

    return props.items.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onSelection(item)} style={style.item} disabled={hasSelected}>
            {item.icon && (
                <MaterialCommunityIcons name={item.icon} size={30} color={colors.text} style={style.icon} />
            )}

            <Text style={style.text}>{item.text}</Text>
        </TouchableOpacity>
    ));
}

function styling(colors: Colors) {
    return StyleSheet.create({
        item: {
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            padding: 10
        },
        icon: {
            marginRight: 10
        },
        text: {
            color: colors.text
        }
    });
}