import { Template } from "pufferpanel";

export type ExtendedTemplate = Template & { repository: number };

export type IncompatibleTemplates = {
    name: string;
    arch: Template[];
    os: Template[];
    env: Template[];
};