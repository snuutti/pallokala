import { ConfigPlugin } from "@expo/config-plugins";
import { withCommonResources } from "./android/withCommonResources";
import { withColorFix } from "./android/withColorFix";
import { withWidgetAndroid } from "./android/withWidgetAndroid";

const withAppConfigs: ConfigPlugin = (config) => {
    config = withCommonResources(config);
    config = withColorFix(config);
    config = withWidgetAndroid(config);

    return config;
};

export default withAppConfigs;