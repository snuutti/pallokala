import { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import LoadingScreen from "@/components/screen/LoadingScreen";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { ExtendedTemplate, IncompatibleTemplates } from "@/types/template";
import { Template } from "pufferpanel";

type SelectTemplateProps = {
    env: string;
    os: string;
    arch: string;
    next: (template: Template) => void;
    back: () => void;
};

export default function SelectTemplate(props: SelectTemplateProps) {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            header: {
                color: colors.text,
                fontSize: 20
            },
            templateHeader: {
                color: colors.text,
                fontSize: 16,
                marginVertical: 5
            },
            template: {
                padding: 15,
                justifyContent: "center",
                backgroundColor: colors.background,
                marginVertical: 5,
                borderRadius: 15
            },
            incompatibleTemplate: {
                backgroundColor: colors.backdrop
            },
            text: {
                color: colors.text
            }
        })
    );
    const { apiClient } = useApiClient();
    const { createMarkdownAlertModal } = useModal();
    const [templates, setTemplates] = useState<(string | ExtendedTemplate)[]>([]);
    const [incompatibleTemplates, setIncompatibleTemplates] = useState<IncompatibleTemplates[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = useCallback(async () => {
        setLoading(true);

        const data = await apiClient!.template.listAllTemplates();
        const sortedRepos = data.sort((a, b) => a.id - b.id);
        const newTemplates: (string | ExtendedTemplate)[] = [];
        const newIncompatibleTemplates: IncompatibleTemplates[] = [];

        for (const repository of sortedRepos) {
            if (repository.templates.length === 0) {
                continue;
            }

            newTemplates.push(repository.name);

            const incompatible: IncompatibleTemplates = {
                name: repository.name,
                arch: [],
                os: [],
                env: []
            };

            for (const template of repository.templates) {
                const envMatches = templateEnvMatches(template);
                const osMatches = templateOsMatches(template);
                const archMatches = templateArchMatches(template);

                if (!envMatches || !osMatches || !archMatches) {
                    if (!envMatches) {
                        incompatible.env.push(template);
                    }

                    if (!osMatches) {
                        incompatible.os.push(template);
                    }

                    if (!archMatches) {
                        incompatible.arch.push(template);
                    }

                    continue;
                }

                newTemplates.push({ ...template, repository: repository.id });
            }

            if (incompatible.arch.length > 0 || incompatible.os.length > 0 || incompatible.env.length > 0) {
                newIncompatibleTemplates.push(incompatible);
            }
        }

        setTemplates(newTemplates);
        setIncompatibleTemplates(newIncompatibleTemplates);
        setLoading(false);
    }, []);

    const templateEnvMatches = (template: Template) => {
        if (!template.supportedEnvironments) {
            if (!template.environment) {
                return false;
            }

            template.supportedEnvironments = [template.environment];
        }

        return template.supportedEnvironments.filter((env) => env.type === props.env).length !== 0;
    };

    const templateOsMatches = (template: Template) =>  {
        if (!template.requirements || !template.requirements.os) {
            return true;
        }

        return template.requirements.os === props.os;
    };

    const templateArchMatches = (template: Template) => {
        if (!template.requirements || !template.requirements.arch) {
            return true;
        }

        return template.requirements.arch === props.arch;
    };

    const pickTemplate = async (template: ExtendedTemplate) => {
        const templateData = await apiClient?.template.get(template.repository, template.name);
        if (!templateData) {
            return;
        }

        if (templateData.readme) {
            createMarkdownAlertModal(
                templateData.display,
                templateData.readme,
                [
                    {
                        text: t("servers:SelectThisTemplate"),
                        icon: "check",
                        onPress: () => props.next(templateData)
                    },
                    {
                        text: t("common:Cancel"),
                        icon: "close",
                        style: "danger"
                    }
                ]
            );
        } else {
            props.next(templateData);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Text style={style.header}>{t("servers:SelectTemplate")}</Text>

            <FlashList
                data={templates}
                renderItem={({ item }) => {
                    if (typeof item === "string") {
                        return <Text style={style.templateHeader}>{item}</Text>;
                    }

                    const templateItem = item as ExtendedTemplate;

                    return (
                        <TouchableOpacity style={style.template} onPress={() => pickTemplate(templateItem)}>
                            <Text style={style.text}>{templateItem.display}</Text>
                        </TouchableOpacity>
                    );
                }}
                getItemType={(item) => {
                    return typeof item === "string" ? "header" : "template";
                }}
                estimatedItemSize={58}
                contentContainerStyle={style.templatesContainer}
            />

            {incompatibleTemplates.length > 0 && (
                <>
                    <Text style={style.header}>{t("servers:IncompatibleTemplates")}</Text>
                    <Text style={style.text}>{t("servers:IncompatibleTemplatesDescription")}</Text>

                    {incompatibleTemplates.map((incompatibleRepo, index) => (
                        <View key={index}>
                            <Text style={style.templateHeader}>{incompatibleRepo.name}</Text>

                            {incompatibleRepo.arch.length > 0 && (
                                <>
                                    <Text style={style.templateHeader}>{t("servers:IncompatibleArch", { arch: props.arch })}</Text>
                                    <FlashList
                                        data={incompatibleRepo.arch}
                                        renderItem={({ item }) => (
                                            <View style={[style.template, style.incompatibleTemplate]}>
                                                <Text style={style.text}>{item.display}</Text>
                                            </View>
                                        )}
                                        estimatedItemSize={58}
                                        contentContainerStyle={style.templatesContainer}
                                    />
                                </>
                            )}

                            {incompatibleRepo.os.length > 0 && (
                                <>
                                    <Text style={style.templateHeader}>{t("servers:IncompatibleOs", { os: props.os })}</Text>
                                    <FlashList
                                        data={incompatibleRepo.os}
                                        renderItem={({ item }) => (
                                            <View style={[style.template, style.incompatibleTemplate]}>
                                                <Text style={style.text}>{item.display}</Text>
                                            </View>
                                        )}
                                        estimatedItemSize={58}
                                        contentContainerStyle={style.templatesContainer}
                                    />
                                </>
                            )}

                            {incompatibleRepo.env.length > 0 && (
                                <>
                                    <Text style={style.templateHeader}>{t("servers:IncompatibleEnv", { env: props.env })}</Text>
                                    <FlashList
                                        data={incompatibleRepo.env}
                                        renderItem={({ item }) => (
                                            <View style={[style.template, style.incompatibleTemplate]}>
                                                <Text style={style.text}>{item.display}</Text>
                                            </View>
                                        )}
                                        estimatedItemSize={58}
                                        contentContainerStyle={style.templatesContainer}
                                    />
                                </>
                            )}
                        </View>
                    ))}
                </>
            )}

            <Button
                text={t("common:Back")}
                icon="chevron-left"
                style="danger"
                onPress={props.back}
            />
        </>
    );
}