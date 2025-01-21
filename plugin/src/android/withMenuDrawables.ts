import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import * as path from "node:path";
import * as fs from "fs-extra";

export const withMenuDrawables: ConfigPlugin = (config) => {
    return withDangerousMod(config, [
        "android",
        async (newConfig) => {
            const projectRoot = newConfig.modRequest.projectRoot;
            const platformRoot = newConfig.modRequest.platformProjectRoot;
            const drawablesDir = path.join(projectRoot, "native/menu/drawable");
            const platformDrawablesDir = path.join(platformRoot, "app/src/main/res/drawable");

            fs.copySync(drawablesDir, platformDrawablesDir);

            return newConfig;
        }
    ]);
};