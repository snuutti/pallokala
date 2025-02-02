import { ConfigPlugin, withAppBuildGradle } from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

export const withWidgetViewBinding: ConfigPlugin = (config) => {
    return withAppBuildGradle(config, (newConfig) => {
        newConfig.modResults.contents = mergeContents({
            src: newConfig.modResults.contents,
            newSrc: "    buildFeatures {\n" +
                "        viewBinding true\n" +
                "    }",
            tag: "view binding",
            anchor: /androidResources \{/,
            offset: 3,
            comment: "//"
        }).contents;

        return newConfig;
    });
};