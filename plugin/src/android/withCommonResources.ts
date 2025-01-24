import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import * as path from "node:path";
import * as fs from "fs-extra";

export const withCommonResources: ConfigPlugin = (config) => {
    return withDangerousMod(config, [
        "android",
        async (newConfig) => {
            const projectRoot = newConfig.modRequest.projectRoot;
            const platformRoot = newConfig.modRequest.platformProjectRoot;
            const commonDir = path.join(projectRoot, "native/common");
            const platformResourcesDir = path.join(platformRoot, "app/src/main/res");

            fs.copySync(commonDir, platformResourcesDir);

            return newConfig;
        }
    ]);
};