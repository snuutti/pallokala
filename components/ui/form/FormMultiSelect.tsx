import { useController, UseControllerProps, FieldValues } from "react-hook-form";
import MultiSelect, { MultiSelectProps } from "@/components/ui/MultiSelect";

export type FormMultiSelectProps<TFieldValues extends FieldValues> = Omit<MultiSelectProps, "items" | "onChange"> & UseControllerProps<TFieldValues>;

export default function FormMultiSelect<TFieldValues extends FieldValues>(props: FormMultiSelectProps<TFieldValues>) {
    const { field } = useController<TFieldValues>({
        name: props.name,
        rules: props.rules,
        defaultValue: props.defaultValue,
        control: props.control
    });

    return (
        <MultiSelect
            {...props}
            items={field.value}
            onChange={(value) => {
                field.onChange(value);
                field.onBlur();
            }}
        />
    );
}