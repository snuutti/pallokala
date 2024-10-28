import { Text } from "react-native";
import Switch from "@/components/ui/Switch";
import TextInput from "@/components/ui/TextInput";
import { Variable } from "pufferpanel";

type SettingInputProps = {
    variable: Variable;
    setVariable: (value: unknown) => void;
    disabled: boolean;
};

export default function SettingInput(props: SettingInputProps) {
    if (props.variable.type === "boolean") {
        return (
            <Switch
                label={props.variable.display!}
                description={props.variable.desc}
                value={props.variable.value as boolean}
                onValueChange={props.setVariable}
                disabled={props.disabled}
            />
        );
    } else if (props.variable.type === "option") {
        return <Text>Dropdown not yet implemented</Text>;
    } else if (props.variable.options) {
        return <Text>Suggestion text input not yet implemented</Text>;
    }

    return (
        <TextInput
            defaultValue={String(props.variable.value as string)}
            onChangeText={props.setVariable}
            placeholder={props.variable.display}
            description={props.variable.desc}
            keyboardType={props.variable.type === "integer" ? "numeric" : "default"}
            editable={!props.disabled}
        />
    );
}