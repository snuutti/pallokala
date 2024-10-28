import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Variables from "@/components/server/settings/Variables";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useServer } from "@/context/ServerProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { ServerDefinition, ServerSettings, ServerFlags } from "pufferpanel";

export default function SettingsScreen() {
    const { style } = useStyle(styling);
    const { server } = useServer();
    const { showSuccess } = useToast();
    const [variables, setVariables] = useState<ServerDefinition | ServerSettings | null>(null);
    const [flags, setFlags] = useState<ServerFlags | null>(null);

    useEffect(() => {
        if (!server) {
            return;
        }

        if (server.hasScope("server.definition.view")) {
            server.getDefinition().then(setVariables);
        } else if (server.hasScope("server.data.view")) {
            server.getData().then(setVariables);
        }

        server.getFlags().then(setFlags);
    }, [server]);

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

    const save = async () => {
        if (!server || !variables) {
            return;
        }

        const data: Record<string, unknown> = {};
        Object.entries(variables.data!).forEach(([key, value]) => {
            data[key] = value.value;
        });

        if (server.hasScope("server.data.edit.admin")) {
            await server.adminUpdateData(data);
        } else if (server.hasScope("server.data.edit")) {
            await server.updateData(data);
        }

        if (server.hasScope("server.flags.edit")) {
            await server.setFlags(flags!);
        }

        showSuccess("Settings saved");
    };

    if (!variables || !flags) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Variables
                variables={variables}
                setVariable={setVariable}
                disabled={!server?.hasScope("server.data.edit")}
            />

            <Text style={style.header}>Autostart conditions</Text>

            {Object.entries(flags).map(([key, value]) => (
                <Switch
                    key={key}
                    label={key}
                    value={value}
                    onValueChange={() => toggleFlag(key)}
                    disabled={!server?.hasScope("server.flags.edit")}
                />
            ))}

            <Button
                text="Save Settings"
                icon="content-save"
                onPress={save}
            />
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        header: {
            color: colors.text,
            fontSize: 16,
            marginBottom: 5
        }
    });
}