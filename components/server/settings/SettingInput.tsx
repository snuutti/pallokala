import { Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Switch from "@/components/ui/Switch";
import Dropdown from "@/components/ui/Dropdown";
import TextInput from "@/components/ui/TextInput";
import { useStyle } from "@/hooks/useStyle";
import { Variable } from "pufferpanel";
import HTMLReactParser from "html-react-parser";
import type { DOMNode, Text as TextNode } from "html-dom-parser";

type SettingInputProps = {
    variable: Variable;
    setVariable: (value: unknown) => void;
    disabled: boolean;
};

export default function SettingInput(props: SettingInputProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            link: {
                color: colors.primary
            }
        })
    );

    const openUrl = async (url: string) => {
        await WebBrowser.openBrowserAsync(url);
    };

    const transform = (node: DOMNode) => {
        if (node.type === "tag" && node.name === "a") {
            return (
                <Text style={style.link} onPress={() => openUrl(node.attribs.href)}>
                    {(node.children[0] as TextNode).data}
                </Text>
            );
        }

        return undefined;
    };

    if (props.variable.type === "boolean") {
        return (
            <Switch
                label={props.variable.display!}
                description={props.variable.desc && HTMLReactParser(props.variable.desc, { replace: transform })}
                value={props.variable.value as boolean}
                onValueChange={props.setVariable}
                disabled={props.disabled}
            />
        );
    } else if (props.variable.type === "option") {
        return (
            <Dropdown
                options={props.variable.options!}
                value={props.variable.value as string}
                onChange={props.setVariable}
                label={props.variable.display}
                description={props.variable.desc && HTMLReactParser(props.variable.desc, { replace: transform })}
                disabled={props.disabled}
            />
        );
    } else if (props.variable.options) {
        return (
            <Dropdown
                options={props.variable.options}
                value={props.variable.value as string}
                onChange={props.setVariable}
                label={props.variable.display}
                description={props.variable.desc && HTMLReactParser(props.variable.desc, { replace: transform })}
                disabled={props.disabled}
            />
        );
    }

    return (
        <TextInput
            defaultValue={String(props.variable.value as string)}
            onChangeText={props.setVariable}
            placeholder={props.variable.display}
            description={props.variable.desc && HTMLReactParser(props.variable.desc, { replace: transform })}
            keyboardType={props.variable.type === "integer" ? "numeric" : "default"}
            editable={!props.disabled}
        />
    );
}