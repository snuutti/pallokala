import { useController, UseControllerProps, FieldValues } from "react-hook-form";
import Dropdown, { DropdownProps } from "@/components/ui/Dropdown";

export type FormDropdownProps<TFieldValues extends FieldValues> = Omit<DropdownProps, "value" | "onChange"> & UseControllerProps<TFieldValues> & {
    onChange?: (value: any) => void;
};

export default function FormDropdown<TFieldValues extends FieldValues>(props: FormDropdownProps<TFieldValues>) {
    const { field } = useController<TFieldValues>({
        name: props.name,
        rules: props.rules,
        defaultValue: props.defaultValue,
        control: props.control
    });

    return (
        <Dropdown
            {...props}
            value={field.value}
            onChange={(value) => {
                field.onChange(value);
                field.onBlur();
                props.onChange?.(value);
            }}
        />
    );
}