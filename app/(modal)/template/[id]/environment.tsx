import { useState, useEffect, useMemo } from "react";
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
import { environmentDefaults } from "@/constants/template";
import { Environment, EnvironmentDefault } from "@/types/template";
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
    const { template, setTemplate } = useTemplateEditor();
    const returnedEnvironmentData = useBoundStore(state => state.returnedEnvironmentData);
    const setInitialEnvironmentData = useBoundStore(state => state.setInitialEnvironmentData);
    const setReturnedEnvironmentData = useBoundStore(state => state.setReturnedEnvironmentData);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!returnedEnvironmentData) {
            return;
        }

        if (editIndex === undefined) {
            return;
        }

        const newTemplate = { ...template! };
        newTemplate.supportedEnvironments![editIndex] = returnedEnvironmentData;

        setTemplate(newTemplate);
        setEditIndex(undefined);
        setInitialEnvironmentData(undefined);
    }, [returnedEnvironmentData, editIndex]);

    const unsupportedEnvironments = useMemo(() => {
        return environments.filter(environment => {
            return (template?.supportedEnvironments || []).filter(e => e.type === environment.value).length === 0;
        });
    }, [template]);

    const edit = (data: MetadataType, index: number, adding: boolean) => {
        setEditIndex(index);
        setInitialEnvironmentData({
            data,
            unsupportedEnvironments,
            adding
        });

        setReturnedEnvironmentData(undefined);
        router.push("/(modal)/editenvironment");
    };

    const add = () => {
        const environment = environmentDefaults[unsupportedEnvironments[0].value as keyof EnvironmentDefault];

        const newTemplate = { ...template! };
        newTemplate.supportedEnvironments = [...(newTemplate.supportedEnvironments || []), environment];

        setTemplate(newTemplate);
        edit(environment, newTemplate.supportedEnvironments.length - 1, true);
    };

    const remove = (index: number) => {
        const newTemplate = { ...template! };
        const environment = newTemplate.supportedEnvironments![index];

        newTemplate.supportedEnvironments!.splice(index, 1);

        if (newTemplate.environment.type === environment.type) {
            newTemplate.environment = newTemplate.supportedEnvironments![0];
        }

        setTemplate(newTemplate);
    };

    return (
        <ContentWrapper>
            <RemoteTemplateAlert />

            {template?.supportedEnvironments?.map((env, index) => (
                <TouchableOpacity key={env.type} onPress={() => edit(env, index, false)} style={style.environment}>
                    <Text style={style.name}>{t(`env:${env.type}.name`)}</Text>

                    <TouchableOpacity
                        onPress={() => remove(index)}
                        disabled={template!.supportedEnvironments!.length < 2}
                    >
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