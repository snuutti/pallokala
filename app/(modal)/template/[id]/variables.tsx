import { Fragment, useMemo } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import VariableListItem from "@/components/templates/variables/VariableListItem";
import Hr from "@/components/ui/Hr";
import Button from "@/components/ui/Button";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";
import { useStyle } from "@/hooks/useStyle";

export default function VariablesScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            nameView: {
                marginBottom: 5
            },
            nameViewWithActions: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            },
            header: {
                flex: 1,
                flexGrow: 1,
                color: colors.text,
                fontSize: 16,
            },
            description: {
                color: colors.textDisabled,
                marginBottom: 10
            },
            actionsView: {
                flexDirection: "row",
                justifyContent: "space-between"
            },
            actionDisabled: {
                opacity: 0.4
            }
        })
    );
    const { template } = useTemplateEditor();

    const grouplessVars = useMemo(() => {
        if (template?.groups && Array.isArray(template.groups)) {
            return Object.keys(template?.data || {}).filter(variableName => {
                return !template.groups?.map(group => group.variables).flat().includes(variableName);
            });
        } else {
            return Object.keys(template?.data || {});
        }
    }, [template]);

    const isFirstGroup = (order: number) => {
        if (!template?.groups) {
            return false;
        }

        let min = Infinity;
        for (const group of template.groups) {
            if (group.order < min) {
                min = group.order;
            }
        }

        return order === min;
    };

    const getLastGroup = () => {
        if (!template?.groups) {
            return 0;
        }

        let max = -Infinity;
        for (const group of template.groups) {
            if (group.order > max) {
                max = group.order;
            }
        }

        return max === -Infinity ? 0 : max;
    };

    const isLastGroup = (order: number) => {
        return order === getLastGroup();
    };

    return (
        <ContentWrapper>
            <Text style={style.description}>{t("templates:description.Variables")}</Text>

            {template?.groups && template.groups.length > 0 ? (
                <>
                    {template.groups.map((group, index) => (
                        <Fragment key={index}>
                            <View style={style.nameView}>
                                <Text style={style.header}>{group.display}</Text>
                                <Text style={style.description}>{group.description}</Text>
                            </View>

                            <View style={style.actionsView}>
                                <TouchableOpacity>
                                    <MaterialCommunityIcons
                                        name="pencil"
                                        size={30}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <MaterialCommunityIcons
                                        name="plus"
                                        size={30}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity disabled={isFirstGroup(group.order)}>
                                    <MaterialCommunityIcons
                                        name="chevron-up"
                                        size={30}
                                        color={colors.text}
                                        style={isFirstGroup(group.order) && style.actionDisabled}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity disabled={isLastGroup(group.order)}>
                                    <MaterialCommunityIcons
                                        name="chevron-down"
                                        size={30}
                                        color={colors.text}
                                        style={isLastGroup(group.order) && style.actionDisabled}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={30}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>
                            </View>

                            {group.variables.map((name) => (
                                <VariableListItem
                                    key={name}
                                    variable={template.data![name]}
                                    canChangeGroup={true}
                                />
                            ))}

                            {(!isLastGroup(group.order) || grouplessVars.length > 0) && (
                                <Hr />
                            )}
                        </Fragment>
                    ))}

                    {grouplessVars.length > 0 && (
                        <>
                            <View style={[style.nameView, style.nameViewWithActions]}>
                                <Text style={style.header}>{t("templates:NoGroup")}</Text>

                                <TouchableOpacity>
                                    <MaterialCommunityIcons
                                        name="plus"
                                        size={30}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>
                            </View>

                            {grouplessVars.map((name) => (
                                <VariableListItem
                                    key={name}
                                    variable={template.data![name]}
                                    canChangeGroup={true}
                                />
                            ))}
                        </>
                    )}
                </>
            ) : (
                <>
                    {Object.entries(template?.data || {}).map(([name, variable]) => (
                        <VariableListItem
                            key={name}
                            variable={variable}
                            canChangeGroup={false}
                        />
                    ))}

                    <Button
                        text={t("templates:AddVariable")}
                        icon="plus"
                        onPress={() => {}}
                    />
                </>
            )}

            <Button
                text={t("templates:AddVariableGroup")}
                icon="plus"
                onPress={() => {}}
            />
        </ContentWrapper>
    );
}