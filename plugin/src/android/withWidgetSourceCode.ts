import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import * as path from "node:path";
import * as fs from "fs-extra";
import { glob } from "glob";

export const withWidgetSourceCode: ConfigPlugin = (config) => {
    return withDangerousMod(config, [
        "android",
        async (newConfig) => {
            const projectRoot = newConfig.modRequest.projectRoot;
            const platformRoot = newConfig.modRequest.platformProjectRoot;
            const widgetDir = path.join(projectRoot, "native/widget");
            copyResourceFiles(widgetDir, platformRoot);

            const packageName = config.android?.package;
            await copySourceCode(widgetDir, platformRoot, packageName!);

            return newConfig;
        }
    ]);
};

function copyResourceFiles(widgetSourceDir: string, platformRoot: string) {
    const source = path.join(widgetSourceDir, "android/src/main/res");
    const resDest = path.join(platformRoot, "app/src/main/res");

    fs.copySync(source, resDest);
}

async function copySourceCode(widgetSourceDir: string, platformRoot: string, packageName: string) {
    const packageDirPath = packageName.replace(/\./g, "/");

    const source = path.join(widgetSourceDir, "android/src/main/java/package_name");
    const dest = path.join(platformRoot, "app/src/main/java", packageDirPath);
    fs.copySync(source, dest);

    const files = glob.sync(`${dest}/*.kt`);
    for (const file of files) {
        const content = fs.readFileSync(file, "utf8");
        const newContent = content.replace(/^package .*\s/, `package ${packageName}\n`);
        fs.writeFileSync(file, newContent);
    }
}