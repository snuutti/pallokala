import { useController, UseControllerProps, FieldValues } from "react-hook-form";
import TextInput, { TextInputProps } from "@/components/ui/TextInput";

export type FormTextInputProps<TFieldValues extends FieldValues> = TextInputProps & UseControllerProps<TFieldValues> & {
    numeric?: boolean;
};

export default function FormTextInput<TFieldValues extends FieldValues>(props: FormTextInputProps<TFieldValues>) {
    const { field } = useController<TFieldValues>({
        name: props.name,
        rules: props.rules,
        defaultValue: props.defaultValue,
        control: props.control
    });

    return (
        <TextInput
            {...props}
            value={String(field.value)}
            onChangeText={props.numeric ? (value) => field.onChange(Number(value)) : field.onChange}
            onBlur={field.onBlur}
        />
    );
}
