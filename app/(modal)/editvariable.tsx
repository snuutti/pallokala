import { useState, useEffect, useMemo } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TextInput from "@/components/ui/TextInput";
import Dropdown from "@/components/ui/Dropdown";
import Switch from "@/components/ui/Switch";
import KeyValueInput from "@/components/ui/KeyValueInput";
import Button from "@/components/ui/Button";
import { useBoundStore } from "@/stores/useBoundStore";

const supportsOptions: Record<string, boolean> = {
    string: true,
    options: true
};

export default function EditVariableScreen() {
    const { t } = useTranslation();
    const initialVariableData = useBoundStore(state => state.initialVariableData);
    const setReturnedVariableData = useBoundStore(state => state.setReturnedVariableData);
    const [name, setName] = useState("");
    const [display, setDisplay] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("string");
    const [value, setValue] = useState("");
    const [internal, setInternal] = useState(false);
    const [required, setRequired] = useState(false);
    const [userEdit, setUserEdit] = useState(false);
    const [options, setOptions] = useState<Record<string, unknown>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        if (!initialVariableData) {
            return;
        }

        setName(initialVariableData.name);
        setDisplay(initialVariableData.display || "");
        setDescription(initialVariableData.desc || "");
        setType(initialVariableData.type);
        setValue(initialVariableData.value as string);
        setInternal(initialVariableData.internal || false);
        setRequired(initialVariableData.required);
        setUserEdit(initialVariableData.userEdit);

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

    const save = () => {
        setReturnedVariableData({
            name,
            type,
            value,
            display,
            desc: description,
            required,
            internal,
            userEdit,
            options: Object.keys(options).map((key) => ({
                value: key,
                display: options[key] as string
            }))
        });

        router.back();
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t("common:Name")}
            />

            <TextInput
                value={display}
                onChangeText={setDisplay}
                placeholder={t("templates:Display")}
            />

            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t("templates:variables.Description")}
            />

            <Dropdown
                options={types}
                value={type}
                onChange={(type) => setType(type as string)}
                label={t("templates:variables.Type")}
            />

            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={t("templates:variables.Value")}
            />

            <Switch
                label={t("templates:variables.Internal")}
                value={internal}
                onValueChange={setInternal}
            />

            <Switch
                label={t("templates:variables.Required")}
                value={required}
                onValueChange={setRequired}
            />

            <Switch
                label={t("templates:variables.UserEdit")}
                value={userEdit}
                onValueChange={setUserEdit}
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
                onPress={save}
                // TODO: add disabled state
            />
        </ContentWrapper>
    );
}