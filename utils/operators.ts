import { TFunction } from "i18next";
import { ConditionalMetadataType } from "pufferpanel";

export type OperatorOption = {
    name: string;
    type: "text" | "boolean" | "textarea" | "list";
    label?: string;
    hint?: string;
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
    archive: [
        {
            name: "source",
            type: "list",
            default: []
        },
        {
            name: "destination",
            type: "text",
            label: "templates:Filename",
            default: ""
        }
    ],
    extract: [
        {
            name: "source",
            type: "text",
            label: "templates:Filename",
            default: ""
        },
        {
            name: "destination",
            type: "text",
            default: ""
        }
    ],
    console: [
        {
            name: "message",
            type: "text",
            default: ""
        }
    ],
    sleep: [
        {
            name: "duration",
            type: "text",
            default: "5s"
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
            name: "minecraftVersion",
            type: "text",
            label: "templates:MinecraftVersion",
            default: "latest"
        },
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
        },
        {
            name: "outputVariable",
            type: "text",
            default: ""
        }
    ],
    neoforgedl: [
        {
            name: "minecraftVersion",
            type: "text",
            label: "templates:MinecraftVersion",
            default: "latest"
        },
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
        },
        {
            name: "outputVariable",
            type: "text",
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
    ],
    paperdl: [
        {
            name: "project",
            type: "text",
            default: "paper"
        },
        {
            name: "minecraftVersion",
            type: "text",
            label: "templates:MinecraftVersion",
            default: "latest"
        },
        {
            name: "build",
            type: "text",
            default: "latest"
        },
        {
            name: "target",
            type: "text",
            label: "templates:Filename",
            default: "server.jar"
        }
    ],
    curseforge: [
        {
            name: "projectId",
            type: "text",
            default: ""
        },
        {
            name: "fileId",
            type: "text",
            default: ""
        },
        {
            name: "java",
            type: "text",
            default: "java"
        }
    ],
    nodejsdl: [
        {
            name: "version",
            type: "text",
            label: "templates:Version",
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

    if (operator.type === "archive") {
        count = Array.isArray(operator.source) ? operator.source.length : 1;
        if (count === 1) {
            params.file = Array.isArray(operator.source) ? operator.source[0] : operator.source;
        }
    }

    params.n = count;

    // TODO: How to make this work with i18next?
    return t(`operators:${operator.type}.formatted`, params);
}