import { useMemo, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import SettingInput from "@/components/server/settings/SettingInput";
import { useStyle } from "@/hooks/useStyle";
import { resolve_if } from "@/utils/conditions";
import { ServerDefinition, ServerSettings, Variable, Group } from "pufferpanel";

type VariablesProps = {
    variables: ServerDefinition | ServerSettings;
    setVariable: (key: string, value: unknown) => void;
    disabled: boolean;
};

export default function Variables(props: VariablesProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            nameView: {
                marginBottom: 5
            },
            header: {
                color: colors.text,
                fontSize: 16
            },
            description: {
                color: colors.text
            }
        })
    );

    const visibleGroups = useMemo(() => {
        if (!props.variables.groups) {
            return null;
        }

        const data: Record<string, any> = {};
        for (const [key, value] of Object.entries(props.variables.data!)) {
            data[key] = value.value;
        }

        return props.variables.groups!.filter(group => {
            if (group.if) {
                return resolve_if(group.if, data);
            }

            return true;
        });
    }, [props.variables]);

    const sortedGroups = useMemo(() => {
        if (!visibleGroups || visibleGroups.length === 0) {
            return null;
        }

        return visibleGroups.sort((a, b) => a.order - b.order);
    }, [visibleGroups]);

    const renderVariables = (variables: Record<string, Variable>) => {
        return Object.entries(variables).map(([name, variable]) => (
            <SettingInput
                key={name}
                variable={variable}
                setVariable={(value) => props.setVariable(name, value)}
                disabled={props.disabled}
            />
        ));
    };

    const filtered = useCallback((group: Group) => {
        return Object.fromEntries(Object.entries(props.variables.data!).filter(([key, value]) => {
            return group.variables.includes(key) && !value.internal;
        }));
    }, [props.variables.data]);

    const grouplessVarsFiltered = useCallback(() => {
        return Object.fromEntries(Object.entries(props.variables.data!).filter(([key, value]) => {
            return !value.internal && !sortedGroups?.some(group => group.variables.includes(key));
        }));
    }, [props.variables.data, sortedGroups]);

    if (!sortedGroups) {
        return renderVariables(props.variables.data!);
    }

    return sortedGroups.map((group, index) => (
        <View key={index}>
            <View style={style.nameView}>
                <Text style={style.header}>{group.display}</Text>
                <Text style={style.description}>{group.description}</Text>
            </View>

            {renderVariables(filtered(group))}

            {grouplessVarsFiltered.length > 0 && (
                <>
                    <View style={style.nameView}>
                        <Text style={style.header}>Other</Text>
                    </View>

                    {renderVariables(grouplessVarsFiltered())}
                </>
            )}
        </View>
    ));
}