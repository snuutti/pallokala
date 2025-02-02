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

            const packageName = config.android?.package;
            copyResourceFiles(widgetDir, platformRoot, packageName!);
            copySourceCode(widgetDir, platformRoot, packageName!);

            return newConfig;
        }
    ]);
};

function copyResourceFiles(widgetSourceDir: string, platformRoot: string, packageName: string) {
    const source = path.join(widgetSourceDir, "android/src/main/res");
    const dest = path.join(platformRoot, "app/src/main/res");
    fs.copySync(source, dest);

    replacePackageNames(dest, packageName);
}

function copySourceCode(widgetSourceDir: string, platformRoot: string, packageName: string) {
    const packageDirPath = packageName.replace(/\./g, "/");

    const source = path.join(widgetSourceDir, "android/src/main/java/package_name");
    const dest = path.join(platformRoot, "app/src/main/java", packageDirPath);
    fs.copySync(source, dest);

    replacePackageNames(dest, packageName);
}

function replacePackageNames(dest: string, packageName: string) {
    const files = glob.sync(`${dest}/**/*.{kt,xml}`);
    for (const file of files) {
        const relativePath = path.relative(dest, path.dirname(file));

        const subPackage = relativePath.replace(/\//g, ".");
        const fullPackageName = subPackage ? `${packageName}.${subPackage}` : packageName;

        const content = fs.readFileSync(file, "utf8");
        const newContent = content
            .replace(/^package\s+.*$/m, `package ${fullPackageName}`)
            .replace(/package_name/g, packageName);

        fs.writeFileSync(file, newContent);
    }
}