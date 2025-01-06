import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ListModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";

type ListModalProps = {
    items: ListModalButton[];
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
            selected: {
                backgroundColor: colors.primary,
                borderRadius: 5
            },
            icon: {
                marginRight: 10
            },
            text: {
                color: colors.text
            },
            textSelected: {
                color: colors.textPrimary
            }
        })
    );
    const [listHeight, setListHeight] = useState(0);
    const [hasSelected, setHasSelected] = useState(false);

    const onSelection = (item: ListModalButton) => {
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
                    <TouchableOpacity
                        onPress={() => onSelection(item)}
                        style={[style.item, item.selected && style.selected]}
                        disabled={hasSelected}
                    >
                        {item.icon && (
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={30}
                                color={item.selected ? colors.textPrimary : colors.text}
                                style={style.icon}
                            />
                        )}

                        <Text style={item.selected ? style.textSelected : style.text}>{item.text}</Text>
                    </TouchableOpacity>
                )}
                estimatedItemSize={39}
                onContentSizeChange={onContentSizeChange}
            />
        </View>
    );
}