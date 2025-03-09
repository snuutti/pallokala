import { TFunction } from "i18next";
import { ConditionalMetadataType } from "pufferpanel";

export type OperatorOption = {
    name: string;
    type: "text" | "boolean" | "textarea" | "list";
    label?: string;
    modeFile?: string;
    default: unknown;
};

export const operators: Record<string, OperatorOption[]> = {
    download: [
        {
            name: "files",
            type: "list",
            default: []
        }
    ],
    command: [
        {
            name: "commands",
            type: "list",
            default: []
        }
    ],
    alterfile: [
        {
            name: "file",
            type: "text",
            label: "templates:Filename",
            default: ""
        },
        {
            name: "regex",
            type: "boolean",
            default: true
        },
        {
            name: "search",
            type: "text",
            default: ""
        },
        {
            name: "replace",
            type: "text",
            default: ""
        }
    ],
    writefile: [
        {
            name: "target",
            type: "text",
            label: "templates:Filename",
            default: ""
        },
        {
            name: "text",
            type: "textarea",
            modeFile: "target",
            default: ""
        }
    ],
    move: [
        {
            name: "source",
            type: "text",
            default: ""
        },
        {
            name: "target",
            type: "text",
            default: ""
        }
    ],
    mkdir: [
        {
            name: "target",
            type: "text",
            label: "common:Name",
            default: ""
        }
    ],
    steamgamedl: [
        {
            name: "appId",
            type: "text",
            default: ""
        }
    ],
    javadl: [
        {
            name: "version",
            type: "text",
            label: "templates:Version",
            default: ""
        }
    ],
    mojangdl: [
        {
            name: "version",
            type: "text",
            label: "templates:Version",
            default: ""
        },
        {
            name: "target",
            type: "text",
            label: "templates:Filename",
            default: ""
        }
    ],
    forgedl: [
        {
            name: "version",
            type: "text",
            label: "templates:Version",
            default: ""
        },
        {
            name: "filename",
            type: "text",
            label: "templates:Filename",
            default: ""
        }
    ],
    spongeforgedl: [
        {
            name: "releaseType",
            type: "text",
            default: ""
        }
    ],
    fabricdl: [
        {
            name: "targetFile",
            type: "text",
            label: "templates:Filename",
            default: ""
        }
    ]
};

export function getOperatorLabel(t: TFunction, operator: ConditionalMetadataType) {
    let count = 0;
    const params = { ...operator };

    if (operator.type === "download") {
        count = Array.isArray(operator.files) ? operator.files.length : 1;
        if (count === 1) {
            params.file = Array.isArray(operator.files) ? operator.files[0] : operator.files;
        }
    }

    if (operator.type === "command") {
        count = Array.isArray(operator.commands) ? operator.commands.length : 1;
        if (count === 1) {
            params.command = Array.isArray(operator.commands) ? operator.commands[0] : operator.commands
        }
    }

    params.n = count;

    // TODO: How to make this work with i18next?
    return t(`operators:${operator.type}.formatted`, params);
}