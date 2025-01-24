import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import * as path from "node:path";
import * as fs from "node:fs";

export const withColorFix: ConfigPlugin = (config) => {
    return withDangerousMod(config, [
        "android",
        async (newConfig) => {
            const platformRoot = newConfig.modRequest.platformProjectRoot;
            const stylesXmlPath = path.join(platformRoot, "app/src/main/res/values/styles.xml");

            let stylesXml = fs.readFileSync(stylesXmlPath, "utf-8");
            stylesXml = stylesXml.replaceAll("@android:color/black", "@color/pk_text_color");
            fs.writeFileSync(stylesXmlPath, stylesXml);

            return newConfig;
        }
    ]);
};