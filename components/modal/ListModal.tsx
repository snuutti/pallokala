import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";

type ListModalProps = {
    items: ModalButton[];
    handleClose?: () => void;
};

export default function ListModal(props: ListModalProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            wrapper: {
                maxHeight: "100%"
            },
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
        })
    );
    const [listHeight, setListHeight] = useState(0);
    const [hasSelected, setHasSelected] = useState(false);

    const onSelection = (item: ModalButton) => {
        if (hasSelected) {
            return;
        }

        setHasSelected(true);
        item.onPress?.();
        props.handleClose!();
    };

    const onContentSizeChange = (_width: number, height: number) => {
        setListHeight(height);
    };

    return (
        <View style={[style.wrapper, { height: listHeight }]}>
            <FlashList
                data={props.items}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onSelection(item)} style={style.item} disabled={hasSelected}>
                        {item.icon && (
                            <MaterialCommunityIcons name={item.icon} size={30} color={colors.text} style={style.icon} />
                        )}

                        <Text style={style.text}>{item.text}</Text>
                    </TouchableOpacity>
                )}
                estimatedItemSize={39}
                onContentSizeChange={onContentSizeChange}
            />
        </View>
    );
}