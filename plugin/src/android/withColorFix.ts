import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import * as path from "node:path";
import * as fs from "node:fs";

const lightColorsXml = `<resources>
    <color name="textColor">#000000</color>
</resources>`;

const darkColorsXml = `<resources>
    <color name="textColor">#ffffff</color>
</resources>`;

export const withColorFix: ConfigPlugin = (config) => {
    return withDangerousMod(config, [
        "android",
        async (newConfig) => {
            const platformRoot = newConfig.modRequest.platformProjectRoot;
            const stylesXmlPath = path.join(platformRoot, "app/src/main/res/values/styles.xml");

            let stylesXml = fs.readFileSync(stylesXmlPath, "utf-8");
            stylesXml = stylesXml.replaceAll("@android:color/black", "@color/textColor");
            fs.writeFileSync(stylesXmlPath, stylesXml);

            const valuesNightDir = path.join(platformRoot, "app/src/main/res/values-night");
            fs.mkdirSync(valuesNightDir, { recursive: true });

            const lightColorsXmlPath = path.join(platformRoot, "app/src/main/res/values/colors_pallokala.xml");
            const darkColorsXmlPath = path.join(platformRoot, "app/src/main/res/values-night/colors_pallokala.xml");

            fs.writeFileSync(lightColorsXmlPath, lightColorsXml);
            fs.writeFileSync(darkColorsXmlPath, darkColorsXml);

            return newConfig;
        }
    ]);
};