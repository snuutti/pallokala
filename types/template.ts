import { Template } from "pufferpanel";

export type ExtendedTemplate = Template & { repository: number };

export type IncompatibleTemplates = {
    name: string;
    arch: Template[];
    os: Template[];
    env: Template[];
};

export type Environment = {
    value: string;
    label: string;
};

export type EnvironmentDefault = {
    host: {
        type: "host";
    };
    docker: {
        type: "docker";
        image: string;
    };
};

export const environmentDefaults: EnvironmentDefault = {
    host: {
        type: "host"
    },
    docker: {
        type: "docker",
        image: "pufferpanel/generic"
    }
};