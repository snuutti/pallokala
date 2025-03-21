import { useMemo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";
import { useStyle } from "@/hooks/useStyle";

type Environment = {
    value: string;
    label: string;
};

type EnvironmentDefault = {
    host: {
        type: "host";
    };
    docker: {
        type: "docker";
        image: string;
    };
};

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

const environmentDefaults: EnvironmentDefault = {
    host: {
        type: "host"
    },
    docker: {
        type: "docker",
        image: "pufferpanel/generic"
    }
};

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

    const unsupportedEnvironments = useMemo(() => {
        return environments.filter(environment => {
            return (template?.supportedEnvironments || []).filter(e => e.type === environment.value).length === 0;
        });
    }, [template]);

    return (
        <ContentWrapper>
            {template?.supportedEnvironments?.map((env) => (
                <TouchableOpacity key={env.type} style={style.environment}>
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
                onPress={() => {}}
                disabled={unsupportedEnvironments.length === 0}
            />
        </ContentWrapper>
    );
}