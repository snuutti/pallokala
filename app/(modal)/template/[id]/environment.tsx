import { useMemo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import RemoteTemplateAlert from "@/components/templates/RemoteTemplateAlert";
import Button from "@/components/ui/Button";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";
import { Environment, EnvironmentDefault, environmentDefaults } from "@/types/template";
import { MetadataType } from "pufferpanel";

const environments: Environment[] = [
    {
        value: "host",
        label: "env:host.name"
    },
    {
        value: "docker",
        label: "env:docker.name"
    }
];

export default function EnvironmentScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            environment: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10
            },
            name: {
                color: colors.text,
                flexGrow: 1,
                flexShrink: 1
            },
            deleteDisabled: {
                opacity: 0.4
            }
        })
    );
    const { template } = useTemplateEditor();
    const setInitialEnvironmentData = useBoundStore(state => state.setInitialEnvironmentData);
    const setReturnedEnvironmentData = useBoundStore(state => state.setReturnedEnvironmentData);

    const unsupportedEnvironments = useMemo(() => {
        return environments.filter(environment => {
            return (template?.supportedEnvironments || []).filter(e => e.type === environment.value).length === 0;
        });
    }, [template]);

    const edit = (environment: MetadataType, adding: boolean) => {
        setInitialEnvironmentData({
            data: environment,
            unsupportedEnvironments,
            adding
        });

        setReturnedEnvironmentData(undefined);
        router.push("/(modal)/editenvironment");
    };

    const add = () => {
        const environment = environmentDefaults[unsupportedEnvironments[0].value as keyof EnvironmentDefault];
        // TODO: actually add the environment
        edit(environment, true);
    };

    return (
        <ContentWrapper>
            <RemoteTemplateAlert />

            {template?.supportedEnvironments?.map((env) => (
                <TouchableOpacity key={env.type} onPress={() => edit(env, false)} style={style.environment}>
                    <Text style={style.name}>{t(`env:${env.type}.name`)}</Text>

                    <TouchableOpacity onPress={() => {}} disabled={template!.supportedEnvironments!.length < 2}>
                        <MaterialCommunityIcons
                            name="trash-can"
                            size={30}
                            color={colors.text}
                            style={template!.supportedEnvironments!.length < 2 && style.deleteDisabled}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}

            <Button
                text={t("templates:AddEnvironment")}
                icon="plus"
                onPress={add}
                disabled={unsupportedEnvironments.length === 0}
            />
        </ContentWrapper>
    );
}