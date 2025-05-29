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
    const { template, setTemplate } = useTemplateEditor();

    const stopType = useMemo(() => {
        if (template!.run.stop || template!.run.stop === "") {
            return "command";
        }

        return "signal";
    }, [template]);

    const addCommand = () => {
        const newTemplate = { ...template! };

        if (!Array.isArray(newTemplate.run.command)) {
            newTemplate.run.command = [{ command: newTemplate.run.command, if: "" }];
        }

        newTemplate.run.command.push({ command: "", if: "" });

        setTemplate(newTemplate);
    };

    const updateStopType = (value: string) => {
        const newTemplate = { ...template! };

        if (value === "command") {
            delete newTemplate.run.stopCode;
            newTemplate.run.stop = "";
        } else if (value === "signal") {
            delete newTemplate.run.stop;
            newTemplate.run.stopCode = 2;
        }

        setTemplate(newTemplate);
    };

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
                    onChangeText={(value) => {
                        setTemplate({ ...template!, run: { ...template!.run, command: value } });
                    }}
                    placeholder={t("templates:Command")}
                    description={t("templates:description.Command")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    // TODO: Add validation
                />
            )}

            <Button
                text={t("templates:AddCommand")}
                icon="plus"
                onPress={addCommand}
            />

            <TextInput
                value={template?.run.workingDirectory}
                onChangeText={(value) => {
                    setTemplate({ ...template!, run: { ...template!.run, workingDirectory: value } });
                }}
                placeholder={t("templates:WorkingDirectory")}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <Dropdown
                options={stopTypes}
                value={stopType}
                onChange={(value) => updateStopType(value as string)}
            />

            {stopType === "command" && (
                <TextInput
                    value={template!.run.stop}
                    onChangeText={(value) => {
                        setTemplate({ ...template!, run: { ...template!.run, stop: value } });
                    }}
                    placeholder={t("templates:StopCommand")}
                    description={t("templates:description.StopCommand")}
                />
            )}

            {stopType === "signal" && (
                <Dropdown
                    options={stopSuggestions}
                    value={String(template!.run.stopCode)}
                    onChange={(value) => {
                        setTemplate({ ...template!, run: { ...template!.run, stopCode: value as number } });
                    }}
                    label={t("templates:StopSignal")}
                    description={t("templates:description.StopSignal")}
                />
            )}

            <KeyValueInput
                label={t("templates:EnvVars")}
                addLabel={t("templates:AddEnvVar")}
                fields={template?.run.environmentVars || {}}
                onChange={(value) => {
                    setTemplate({ ...template!, run: { ...template!.run, environmentVars: value as Record<string, string> } });
                }}
            />
        </ContentWrapper>
    );
}