import { useState, useEffect, useMemo, Fragment } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ContentWrapper from "@/components/screen/ContentWrapper";
import RemoteTemplateAlert from "@/components/templates/RemoteTemplateAlert";
import VariableListItem from "@/components/templates/variables/VariableListItem";
import Hr from "@/components/ui/Hr";
import Button from "@/components/ui/Button";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";
import { useModal, ListModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";
import { ExtendedVariable } from "@/types/template";
import { Group } from "pufferpanel";

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
    const { template, setTemplate } = useTemplateEditor();
    const { createPromptModal, createListModal } = useModal();
    const returnedVariableData = useBoundStore(state => state.returnedVariableData);
    const setInitialVariableData = useBoundStore(state => state.setInitialVariableData);
    const setReturnedVariableData = useBoundStore(state => state.setReturnedVariableData);
    const returnedVariableGroupData = useBoundStore(state => state.returnedVariableGroupData);
    const setInitialVariableGroupData = useBoundStore(state => state.setInitialVariableGroupData);
    const setReturnedVariableGroupData = useBoundStore(state => state.setReturnedVariableGroupData);
    const [editGroupIndex, setEditGroupIndex] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!returnedVariableData) {
            return;
        }

        const newTemplate = { ...template! };
        const name = returnedVariableData.name;
        const oldName = returnedVariableData.oldName;

        delete (returnedVariableData as Partial<ExtendedVariable>).name;
        delete (returnedVariableData as Partial<ExtendedVariable>).oldName;

        if (oldName !== undefined && oldName !== name) {
            delete newTemplate.data![oldName];

            newTemplate.groups = newTemplate.groups?.map(group => {
                group.variables = group.variables.map(variableName => {
                    if (variableName === oldName) {
                        return name;
                    }

                    return variableName;
                });

                return group;
            });
        }

        newTemplate.data![name] = returnedVariableData;

        setTemplate(newTemplate);
        setReturnedVariableData(undefined);
    }, [returnedVariableData]);

    useEffect(() => {
        if (!returnedVariableGroupData) {
            return;
        }

        if (editGroupIndex === undefined) {
            return;
        }

        const newTemplate = { ...template! };
        newTemplate.groups![editGroupIndex] = returnedVariableGroupData;

        setTemplate(newTemplate);
        setEditGroupIndex(undefined);
        setReturnedVariableGroupData(undefined);
    }, [returnedVariableGroupData, editGroupIndex]);

    const grouplessVars = useMemo(() => {
        if (template?.groups && Array.isArray(template.groups)) {
            return Object.keys(template?.data || {}).filter(variableName => {
                return !template.groups?.map(group => group.variables).flat().includes(variableName);
            });
        } else {
            return Object.keys(template?.data || {});
        }
    }, [template]);

    const removeVariable = (name: string) => {
        const newTemplate = { ...template! };
        delete newTemplate.data![name];
        newTemplate.groups = newTemplate.groups?.map(group => {
            group.variables = group.variables.filter(variableName => variableName !== name);
            return group;
        });

        setTemplate(newTemplate);
    };

    const editVariable = (variable: ExtendedVariable) => {
        setInitialVariableData(variable);
        setReturnedVariableData(undefined);
        router.push("/(modal)/editvariable");
    };

    const editVariableByName = (name: string) => {
        const variable = template?.data![name];
        if (!variable) {
            return;
        }

        editVariable({ ...variable, name });
    };

    const addVariableAlert = (group?: Group) => {
        createPromptModal(
            t("templates:AddVariable"),
            {
                placeholder: t("common:Name"),
                inputType: "default"
            },
            [
                {
                    text: t("templates:AddVariable"),
                    icon: "plus",
                    onPress: (name: string) => {
                        addVariable(name, group);
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const addVariable = (name: string, group?: Group) => {
        const newTemplate = { ...template! };

        const newVariable: ExtendedVariable = {
            name,
            type: "string",
            value: "",
            display: "",
            desc: "",
            required: false,
            internal: false,
            userEdit: false,
            options: []
        };

        newTemplate.data![newVariable.name] = newVariable;

        if (group) {
            newTemplate.groups = newTemplate.groups?.map(g => {
                if (g === group) {
                    g.variables.push(newVariable.name);
                }

                return g;
            });
        }

        setTemplate(newTemplate);
        editVariable(newVariable);
    };

    const openChangeGroupList = (name: string, currentGroup?: Group) => {
        const items: ListModalButton[] = [];

        for (const group of (template?.groups || [])) {
            items.push({
                text: group.display,
                onPress: () => changeGroup(name, group, currentGroup),
                selected: group === currentGroup
            });
        }

        createListModal(items);
    };

    const changeGroup = (name: string, group: Group, oldGroup?: Group) => {
        const newTemplate = { ...template! };

        newTemplate.groups = newTemplate.groups!.map(g => {
            if (oldGroup && group === oldGroup && g === group) {
                g.variables = g.variables.filter(variableName => variableName !== name);
            } else if (g === group) {
                g.variables.push(name);
            } else {
                g.variables = g.variables.filter(variableName => variableName !== name);
            }

            return g;
        });

        setTemplate(newTemplate);
    };

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

    const moveGroupUp = (order: number) => {
        const newTemplate = { ...template! };

        newTemplate.groups = newTemplate.groups!.map(group => {
            if (group.order === order) {
                group.order = order - 1;
            } else if (group.order === (order - 1)) {
                group.order = order;
            }

            return group;
        }).sort((a, b) => a.order > b.order ? 1 : -1);

        setTemplate(newTemplate);
    };

    const moveGroupDown = (order: number) => {
        const newTemplate = { ...template! };

        newTemplate.groups = newTemplate.groups!.map(group => {
            if (group.order === order) {
                group.order = order + 1;
            } else if (group.order === (order + 1)) {
                group.order = order;
            }

            return group;
        }).sort((a, b) => a.order > b.order ? 1 : -1);

        setTemplate(newTemplate);
    };

    const removeGroup = (group: Group) => {
        const newTemplate = { ...template! };
        newTemplate.groups = newTemplate.groups!.filter(g => g !== group);
        setTemplate(newTemplate);
    };

    const editGroup = (index: number, group: Group) => {
        setEditGroupIndex(index);
        setInitialVariableGroupData(group);
        setReturnedVariableGroupData(undefined);
        router.push("/(modal)/editvariablegroup");
    };

    const addVariableGroup = () => {
        const newTemplate = { ...template! };

        if (!Array.isArray(newTemplate.groups)) {
            newTemplate.groups = [];
        }

        const newGroup: Group = {
            display: "",
            description: "",
            variables: [],
            order: getLastGroup() + 1
        };

        newTemplate.groups.push(newGroup);
        setTemplate(newTemplate);
        editGroup(newTemplate.groups.length - 1, newGroup);
    };

    return (
        <ContentWrapper>
            <RemoteTemplateAlert />

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
                                <TouchableOpacity onPress={() => editGroup(index, group)}>
                                    <MaterialCommunityIcons
                                        name="pencil"
                                        size={30}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => addVariableAlert(group)}>
                                    <MaterialCommunityIcons
                                        name="plus"
                                        size={30}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => moveGroupUp(group.order)}
                                    disabled={isFirstGroup(group.order)}
                                >
                                    <MaterialCommunityIcons
                                        name="chevron-up"
                                        size={30}
                                        color={colors.text}
                                        style={isFirstGroup(group.order) && style.actionDisabled}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => moveGroupDown(group.order)}
                                    disabled={isLastGroup(group.order)}
                                >
                                    <MaterialCommunityIcons
                                        name="chevron-down"
                                        size={30}
                                        color={colors.text}
                                        style={isLastGroup(group.order) && style.actionDisabled}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => removeGroup(group)}>
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
                                    name={name}
                                    variable={template.data![name]}
                                    canChangeGroup={true}
                                    edit={() => editVariableByName(name)}
                                    remove={() => removeVariable(name)}
                                    changeGroup={() => openChangeGroupList(name, group)}
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

                                <TouchableOpacity onPress={() => addVariableAlert()}>
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
                                    name={name}
                                    variable={template.data![name]}
                                    canChangeGroup={true}
                                    edit={() => editVariableByName(name)}
                                    remove={() => removeVariable(name)}
                                    changeGroup={() => openChangeGroupList(name)}
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
                            name={name}
                            variable={variable}
                            canChangeGroup={false}
                            edit={() => editVariableByName(name)}
                            remove={() => removeVariable(name)}
                            changeGroup={() => {}}
                        />
                    ))}

                    <Button
                        text={t("templates:AddVariable")}
                        icon="plus"
                        onPress={addVariableAlert}
                    />
                </>
            )}

            <Button
                text={t("templates:AddVariableGroup")}
                icon="plus"
                onPress={addVariableGroup}
            />
        </ContentWrapper>
    );
}