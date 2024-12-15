import { useState, useEffect, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import EnvironmentConfig from "@/components/templates/EnvironmentConfig";
import Variables from "@/components/server/settings/Variables";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";
import { Template, ServerSettings, MetadataType } from "pufferpanel";

type SettingsProps = {
    template: Template;
    environment: string;
    createServer: (settings: ServerSettings, environment: MetadataType) => void;
    back: () => void;
};

export default function Settings(props: SettingsProps) {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            noSettingsText: {
                color: colors.text,
                fontSize: 16,
                marginBottom: 5
            }
        })
    );
    const [variables, setVariables] = useState<ServerSettings | null>(null);
    const [environment, setEnvironment] = useState<MetadataType | null>(null);

    useEffect(() => {
        setVariables({
            data: props.template.data!,
            groups: props.template.groups
        });

        setEnvironment(props.template.supportedEnvironments!.filter(env => env.type === props.environment)[0]);
    }, [props.template]);

    const canSubmit = useMemo(() => {
        if (!variables) {
            return false;
        }

        for (const key in variables.data) {
            const variable = variables.data[key];
            if (!variable.required) {
                continue;
            }

            if (variable.internal) {
                continue;
            }

            if (variable.type === "boolean") {
                continue;
            }

            if (variable.type === "integer" && variable.value === 0) {
                continue;
            }

            if (!variable.value) {
                return false;
            }
        }

        return true;
    }, [variables]);

    const setVariable = (key: string, value: unknown) => {
        if (!variables) {
            return;
        }

        const newVariables = { ...variables };
        newVariables.data![key].value = value;
        setVariables(newVariables);
    };

    return (
        <>
            {environment && (
                <EnvironmentConfig
                    environment={environment}
                    onChange={setEnvironment}
                />
            )}

            {variables && (
                <Variables
                    variables={variables}
                    setVariable={setVariable}
                    disabled={false}
                />
            )}

            {Object.keys(variables?.data || {}).length === 0 && (
                <Text style={style.noSettingsText}>{t("servers:NoSettings")}</Text>
            )}

            <Button
                text={t("servers:Create")}
                icon="content-save"
                onPress={() => props.createServer(variables!, environment!)}
                disabled={!canSubmit}
            />

            <Button
                text={t("common:Back")}
                icon="chevron-left"
                style="danger"
                onPress={props.back}
            />
        </>
    );
}