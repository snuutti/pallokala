import { ConfigPlugin } from "@expo/config-plugins";
import { withWidgetManifest } from "./withWidgetManifest";
import { withWidgetSourceCode } from "./withWidgetSourceCode";

export const withWidgetAndroid: ConfigPlugin = (config) => {
    config = withWidgetManifest(config);
    config = withWidgetSourceCode(config);

    return config;
};