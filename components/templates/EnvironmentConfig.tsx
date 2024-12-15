import { useTranslation } from "react-i18next";
import KeyValueInput from "@/components/ui/KeyValueInput";
import PortMappingInput from "@/components/ui/PortMappingInput";
import TextInput from "@/components/ui/TextInput";
import { MetadataType } from "pufferpanel";

const fields: { [key: string]: any[] } = {
    host: [],
    docker: [
        {
            name: "image",
            type: "text",
            label: "templates:DockerImage",
            default: "pufferpanel/generic"
        },
        {
            name: "containerRoot",
            type: "text",
            default: ""
        },
        {
            name: "networkName",
            type: "text",
            options: [
                "host",
                "bridge"
            ],
            default: "host"
        },
        {
            name: "bindings",
            type: "map",
            hint: "env:docker.BindingsHint",
            keyLabel: "env:docker.HostPath",
            valueLabel: "env:docker.ContainerPath",
            default: {}
        },
        {
            name: "portBindings",
            type: "portBindings",
            label: "env:docker.portBindings",
            hint: "env:docker.PortBindingsHint",
            default: []
        }
    ],
    unsupported: []
};

type EnvironmentConfigProps = {
    environment: MetadataType;
    onChange: (environment: MetadataType) => void;
};

export default function EnvironmentConfig(props: EnvironmentConfigProps) {
    const { t } = useTranslation();

    const getLabel = (field: any): string => {
        if (field.label) {
            return t(field.label);
        }

        return t(`env:${props.environment.type}.${field.name}`);
    };

    const onFieldChange = (field: string, value: unknown) => {
        const newEnvironment = { ...props.environment };
        newEnvironment[field] = value;
        props.onChange(newEnvironment);
    };

    return fields[props.environment.type!].map(field => {
        if (field.type === "map") {
            return (
                <KeyValueInput
                    key={field.name}
                    fields={props.environment[field.name] || field.default}
                    onChange={(fields) => onFieldChange(field.name, fields)}
                    label={getLabel(field)}
                    description={t(field.hint)}
                    keyLabel={t(field.keyLabel)}
                    valueLabel={t(field.valueLabel)}
                />
            );
        } else if (field.type === "portBindings") {
            return (
                <PortMappingInput
                    key={field.name}
                    fields={props.environment[field.name] || field.default}
                    onChange={(fields) => onFieldChange(field.name, fields)}
                    label={getLabel(field)}
                    description={t(field.hint)}
                />
            );
        } else if (field.type === "text") {
            return (
                <TextInput
                    key={field.name}
                    defaultValue={props.environment[field.name] || field.default}
                    onChangeText={(value) => onFieldChange(field.name, value)}
                    placeholder={getLabel(field)}
                    description={t(field.hint)}
                />
            );
        }

        return null;
    });
}