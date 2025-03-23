import { useMemo } from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import RemoteTemplateAlert from "@/components/templates/RemoteTemplateAlert";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import KeyValueInput from "@/components/ui/KeyValueInput";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";

export default function RunScreen() {
    const { t } = useTranslation();
    const { template } = useTemplateEditor();

    const stopType = useMemo(() => {
        if (template!.run.stop || template!.run.stop === "") {
            return "command";
        }

        return "signal";
    }, [template]);

    const stopTypes: DropdownItem[] = [
        {
            value: "command",
            display: t("templates:StopCommand")
        },
        {
            value: "signal",
            display: t("templates:StopSignal")
        }
    ];

    const stopSuggestions: DropdownItem[] = [
        {
            value: "1",
            display: t("templates:signals.1")
        },
        {
            value: "2",
            display: t("templates:signals.2")
        },
        {
            value: "9",
            display: t("templates:signals.9")
        },
        {
            value: "15",
            display: t("templates:signals.15")
        }
    ];

    return (
        <ContentWrapper>
            <RemoteTemplateAlert />

            {Array.isArray(template?.run.command) ? (
                <>
                    {template!.run.command.map((command, index) => (
                        <Text key={index}>{command.command}</Text>
                    ))}
                </>
            ) : (
                <TextInput
                    value={template?.run.command}
                    onChangeText={() => {}}
                    placeholder={t("templates:Command")}
                    description={t("templates:description.Command")}
                    // TODO: Add validation
                />
            )}

            <Button
                text={t("templates:AddCommand")}
                icon="plus"
                onPress={() => {}}
            />

            <TextInput
                placeholder={t("templates:WorkingDirectory")}
            />

            <Dropdown
                options={stopTypes}
                value={stopType}
                onChange={() => {}}
            />

            {stopType === "command" && (
                <TextInput
                    value={template!.run.stop}
                    onChangeText={() => {}}
                    placeholder={t("templates:StopCommand")}
                    description={t("templates:description.StopCommand")}
                />
            )}

            {stopType === "signal" && (
                <Dropdown
                    options={stopSuggestions}
                    value={String(template!.run.stopCode)}
                    onChange={() => {}}
                    label={t("templates:StopSignal")}
                    description={t("templates:description.StopSignal")}
                />
            )}

            <KeyValueInput
                label={t("templates:EnvVars")}
                addLabel={t("templates:AddEnvVar")}
                fields={template?.run.environmentVars || {}}
                onChange={() => {}}
            />
        </ContentWrapper>
    );
}