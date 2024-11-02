import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { Template } from "pufferpanel";

type TemplatesListItemProps = {
    template: Template;
};

export default function TemplatesListItem(props: TemplatesListItemProps) {
    const { style } = useStyle(styling);

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

function styling(colors: Colors) {
    return StyleSheet.create({
        template: {
            height: 70,
            padding: 15,
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: colors.background,
            marginVertical: 5,
            borderRadius: 15
        },
        display: {
            color: colors.text
        },
        type: {
            color: colors.textDisabled
        }
    });
}