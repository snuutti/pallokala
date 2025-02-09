import { ConfigPlugin } from "@expo/config-plugins";
import { withWidgetManifest } from "./withWidgetManifest";
import { withWidgetDependencies } from "./withWidgetDependencies";
import { withWidgetViewBinding } from "./withWidgetViewBinding";
import { withWidgetSourceCode } from "./withWidgetSourceCode";

export const withWidgetAndroid: ConfigPlugin = (config) => {
    config = withWidgetManifest(config);
    config = withWidgetDependencies(config);
    config = withWidgetViewBinding(config);
    config = withWidgetSourceCode(config);

    return config;
};