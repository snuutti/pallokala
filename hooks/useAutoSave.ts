import { useEffect } from "react";
import { FieldValues, Control, useWatch } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

type UseAutoSaveProps<TFieldValues extends FieldValues> = {
    control: Control<TFieldValues>;
    isDirty: boolean;
    onSave: (data: TFieldValues) => Promise<void> | void;
    delay?: number;
};

export function useAutoSave<TFieldValues extends FieldValues>(props: UseAutoSaveProps<TFieldValues>) {
    const watchedValues = useWatch({ control: props.control });
    const debouncedSave = useDebouncedCallback(props.onSave, props.delay || 1000);

    useEffect(() => {
        if (props.isDirty) {
            debouncedSave(watchedValues as TFieldValues);
        }
    }, [props.isDirty, debouncedSave, watchedValues]);
}