import { useController, UseControllerProps, FieldValues } from "react-hook-form";
import Switch, { SwitchProps } from "@/components/ui/Switch";

export type FormSwitchProps<TFieldValues extends FieldValues> = Omit<SwitchProps, "value" | "onValueChange"> & UseControllerProps<TFieldValues>;

export default function FormSwitch<TFieldValues extends FieldValues>(props: FormSwitchProps<TFieldValues>) {
    const { field } = useController<TFieldValues>({
        name: props.name,
        rules: props.rules,
        defaultValue: props.defaultValue,
        control: props.control
    });

    return (
        <Switch
            {...props}
            value={field.value}
            onValueChange={(value) => {
                field.onChange(value);
                field.onBlur();
            }}
        />
    );
}