import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/ui/Dropdown";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import ListInput from "@/components/ui/ListInput";
import { OperatorOption, operators } from "@/utils/operators";
import { ConditionalMetadataType } from "pufferpanel";

type OperatorProps = {
    data: ConditionalMetadataType;
    setData: (data: ConditionalMetadataType) => void;
};

export default function Operator(props: OperatorProps) {
    const { t } = useTranslation();

    const options = useMemo(() => {
        const options = operators[props.data.type!];
        if (!options) {
            return [];
        }

        return options;
    }, [props.data.type]);

    const types = useMemo(() => {
        return Object.keys(operators).map(key => {
            return {
                value: key,
                display: t(`operators:${key}.generic`)
            };
        });
    }, [t]);

    const changeType = (type: string) => {
        updateOption("type", type);

        const newData: ConditionalMetadataType = {
            type,
            if: props.data.if
        };

        operators[type].map(field => {
            newData[field.name] = field.default;
        });

        props.setData(newData);
    };

    const updateOption = (name: string, value: unknown) => {
        props.setData({ ...props.data, [name]: value });
    };

    const getLabel = (option: OperatorOption) => {
        if (option.label) {
            return t(option.label);
        }

        return t(`operators:${props.data.type!}.${option.name}`);
    };

    return (
        <>
            <Dropdown
                options={types}
                value={props.data.type!}
                onChange={(value) => changeType(value as string)}
            />

            <TextInput
                value={props.data.if}
                onChangeText={(value) => updateOption("if", value)}
                placeholder={t("common:Condition")}
                description={t("operators:ConditionHint")}
            />

            {options.map((option, index) => (
                <Fragment key={index}>
                    {/* TODO: Implement textarea with code editor */}
                    {(option.type === "text" || option.type === "textarea") && (
                        <TextInput
                            value={props.data[option.name] as string}
                            onChangeText={(value) => updateOption(option.name, value)}
                            placeholder={getLabel(option)}
                            multiline={option.type === "textarea"}
                        />
                    )}

                    {option.type === "boolean" && (
                        <Switch
                            label={getLabel(option)}
                            value={props.data[option.name] as boolean}
                            onValueChange={(value) => updateOption(option.name, value)}
                        />
                    )}

                    {option.type === "list" && (
                        <ListInput
                            label={getLabel(option)}
                            value={props.data[option.name] as string[]}
                            onValueChange={(value) => updateOption(option.name, value)}
                        />
                    )}
                </Fragment>
            ))}
        </>
    );
}