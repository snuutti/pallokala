import { Template, Variable } from "pufferpanel";

export type ExtendedTemplate = Template & { repository: number };

export type IncompatibleTemplates = {
    name: string;
    arch: Template[];
    os: Template[];
    env: Template[];
};

export type ExtendedVariable = Variable & { name: string };

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