import { ConfigPlugin } from "@expo/config-plugins";
import { withWidgetManifest } from "./withWidgetManifest";
import { withWidgetDependencies } from "./withWidgetDependencies";
import { withWidgetSourceCode } from "./withWidgetSourceCode";

export const withWidgetAndroid: ConfigPlugin = (config) => {
    config = withWidgetManifest(config);
    config = withWidgetDependencies(config);
    config = withWidgetSourceCode(config);

    return config;
};