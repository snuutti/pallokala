import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";
import { Template } from "pufferpanel";

type TemplatesListItemProps = {
    template: Template;
};

export default function TemplatesListItem(props: TemplatesListItemProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            template: {
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
            display: {
                color: colors.text
            },
            type: {
                color: colors.textDisabled
            }
        })
    );

    const onPress = () => {
        // TODO
    };

    return (
        <TouchableOpacity style={style.template} onPress={onPress}>
            <Text style={style.display} numberOfLines={1}>{props.template.display}</Text>
            <Text style={style.type} numberOfLines={1}>{props.template.type}</Text>
        </TouchableOpacity>
    );
}