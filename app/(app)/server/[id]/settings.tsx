import { useState, useEffect, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Variables from "@/components/server/settings/Variables";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useServer } from "@/context/ServerProvider";
import useToast from "@/hooks/useToast";
import { useStyle } from "@/hooks/useStyle";
import { ServerDefinition, ServerSettings, ServerFlags } from "pufferpanel";

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            header: {
                color: colors.text,
                fontSize: 16,
                marginBottom: 5
            }
        })
    );
    const { server } = useServer();
    const { showSuccessAlert } = useToast();
    const [variables, setVariables] = useState<ServerDefinition | ServerSettings | null>(null);
    const [flags, setFlags] = useState<ServerFlags | null>(null);
    const [canGetVariables, setCanGetVariables] = useState(false);

    useEffect(() => {
        if (!server) {
            return;
        }

        if (server.hasScope("server.definition.view")) {
            server.getDefinition().then(setVariables);
            setCanGetVariables(true);
        } else if (server.hasScope("server.data.view")) {
            server.getData().then(setVariables);
            setCanGetVariables(true);
        } else {
            setVariables(null);
            setCanGetVariables(false);
        }

        server.getFlags().then(setFlags);
    }, [server]);

    const anyItems = useMemo(() => {
        return Object.keys(variables?.data || {}).length > 0
            || Object.keys(flags || {}).length > 0;
    }, [variables, flags]);

    const anySettings = useMemo(() => {
        return Object.keys(variables?.data || {}).length > 0;
    }, [variables]);

    const setVariable = (key: string, value: unknown) => {
        if (!variables) {
            return;
        }

        const newVariables = { ...variables };
        newVariables.data![key].value = value;
        setVariables(newVariables);
    };

    const toggleFlag = (key: string) => {
        if (!flags) {
            return;
        }

        const newFlags = { ...flags };
        newFlags[key] = !newFlags[key];
        setFlags(newFlags);
    };

    const getFlagDescription = (flag: string) => {
        const key = `servers:flags.hint.${flag}`;
        if (!i18n.exists(key)) {
            return undefined;
        }

        return t(key);
    };

    const save = async () => {
        if (!server || !variables) {
            return;
        }

        if (anySettings) {
            const data: Record<string, unknown> = {};
            Object.entries(variables.data!).forEach(([key, value]) => {
                data[key] = value.value;
            });

            if (server.hasScope("server.data.edit.admin")) {
                await server.adminUpdateData(data);
            } else if (server.hasScope("server.data.edit")) {
                await server.updateData(data);
            }
        }

        if (server.hasScope("server.flags.edit")) {
            await server.setFlags(flags!);
        }

        showSuccessAlert(t("servers:SettingsSaved"));
    };

    if ((canGetVariables && !variables) || !flags) {
        return <LoadingScreen />;
    }

    if (!anyItems) {
        return (
            <ContentWrapper>
                <Text style={style.header}>{t("servers:NoSettings")}</Text>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper>
            {(variables && anySettings) && (
                <Variables
                    variables={variables}
                    setVariable={setVariable}
                    disabled={!server?.hasScope("server.data.edit")}
                />
            )}

            <Text style={style.header}>{t("servers:FlagsHeader")}</Text>

            {Object.entries(flags).map(([key, value]) => (
                <Switch
                    key={key}
                    label={t(`servers:flags.${key}`)}
                    description={getFlagDescription(key)}
                    value={value}
                    onValueChange={() => toggleFlag(key)}
                    disabled={!server?.hasScope("server.flags.edit")}
                />
            ))}

            <Button
                text={t("servers:SaveSettings")}
                icon="content-save"
                onPress={save}
                disabled={!server?.hasScope("server.data.edit") && !server?.hasScope("server.flags.edit")}
            />
        </ContentWrapper>
    );
}