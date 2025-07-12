import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Dropdown from "@/components/ui/Dropdown";
import FormSwitch from "@/components/ui/form/FormSwitch";
import KeyValueInput from "@/components/ui/KeyValueInput";
import Button from "@/components/ui/Button";
import { useBoundStore } from "@/stores/useBoundStore";
import { ExtendedVariable } from "@/types/template";

const schema = z.object({
    name: z.string().trim().min(1, { message: "errors:ErrFieldRequired" }),
    display: z.string(),
    description: z.string(),
    value: z.string(),
    internal: z.boolean(),
    required: z.boolean(),
    userEdit: z.boolean(),
});

type Schema = z.infer<typeof schema>;

const defaultValues: Schema = {
    name: "",
    display: "",
    description: "",
    value: "",
    internal: false,
    required: false,
    userEdit: false
};

const supportsOptions: Record<string, boolean> = {
    string: true,
    options: true
};

export default function EditVariableScreen() {
    const { t } = useTranslation();
    const initialVariableData = useBoundStore(state => state.initialVariableData);
    const setReturnedVariableData = useBoundStore(state => state.setReturnedVariableData);
    const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [oldName, setOldName] = useState("");
    const [type, setType] = useState("string");
    const [options, setOptions] = useState<Record<string, unknown>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        if (!initialVariableData) {
            return;
        }

        setValue("name", initialVariableData.name, { shouldValidate: true });
        setValue("display", initialVariableData.display || "", { shouldValidate: true });
        setValue("description", initialVariableData.desc || "", { shouldValidate: true });
        setValue("value", initialVariableData.value as string, { shouldValidate: true });
        setValue("internal", initialVariableData.internal || false, { shouldValidate: true });
        setValue("required", initialVariableData.required, { shouldValidate: true });
        setValue("userEdit", initialVariableData.userEdit, { shouldValidate: true });

        setOldName(initialVariableData.name);
        setType(initialVariableData.type);

        const opt: Record<string, unknown> = {};
        initialVariableData.options?.map((option) => {
            opt[option.value] = option.display;
        });

        setOptions(opt);
        setLoading(false);
    }, [initialVariableData]);

    const types = useMemo(() => {
        return [
            {
                value: "string",
                display: t("templates:variables.types.String")
            },
            {
                value: "boolean",
                display: t("templates:variables.types.Boolean")
            },
            {
                value: "integer",
                display: t("templates:variables.types.Number")
            },
            {
                value: "options",
                display: t("templates:variables.types.Options")
            }
        ];
    }, [t]);

    const save = (data: Schema) => {
        const variableData: ExtendedVariable = {
            name: data.name,
            oldName,
            type,
            value: data.value,
            display: data.display,
            desc: data.description,
            required: data.required,
            internal: data.internal,
            userEdit: data.userEdit,
            options: Object.keys(options).map((key) => ({
                value: key,
                display: options[key] as string
            }))
        };

        if (variableData.type === "boolean" || (variableData.options && variableData.options.length === 0)) {
            delete variableData.options;
        }

        setReturnedVariableData(variableData);

        router.back();
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <FormTextInput
                control={control}
                name="name"
                placeholder={t("common:Name")}
                error={errors.name?.message}
                errorFields={{ field: t("common:Name") }}
                autoCapitalize="none"
                autoComplete="off"
            />

            <FormTextInput
                control={control}
                name="display"
                placeholder={t("templates:Display")}
                error={errors.display?.message}
            />

            <FormTextInput
                control={control}
                name="description"
                placeholder={t("templates:variables.Description")}
                error={errors.description?.message}
            />

            <Dropdown
                options={types}
                value={type}
                onChange={(type) => setType(type as string)}
                label={t("templates:variables.Type")}
            />

            <FormTextInput
                control={control}
                name="value"
                placeholder={t("templates:variables.Value")}
                error={errors.value?.message}
                autoCapitalize="none"
                autoComplete="off"
            />

            <FormSwitch
                control={control}
                name="internal"
                label={t("templates:variables.Internal")}
            />

            <FormSwitch
                control={control}
                name="required"
                label={t("templates:variables.Required")}
            />

            <FormSwitch
                control={control}
                name="userEdit"
                label={t("templates:variables.UserEdit")}
            />

            {supportsOptions[type] && (
                <KeyValueInput
                    label={t("templates:variables.Options")}
                    fields={options}
                    onChange={setOptions}
                />
            )}

            <Button
                text={t("common:Apply")}
                icon="content-save"
                onPress={handleSubmit(save)}
                disabled={!isValid}
            />
        </ContentWrapper>
    );
}