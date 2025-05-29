import { EnvironmentDefault } from "@/types/template";

export const environmentDefaults: EnvironmentDefault = {
    host: {
        type: "host"
    },
    docker: {
        type: "docker",
        image: "pufferpanel/generic"
    }
};