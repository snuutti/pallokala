import { ConfigPlugin } from "@expo/config-plugins";
import { withCommonResources } from "./android/withCommonResources";
import { withWidgetAndroid } from "./android/withWidgetAndroid";

const withAppConfigs: ConfigPlugin = (config) => {
    config = withCommonResources(config);
    config = withWidgetAndroid(config);

    return config;
};

export default withAppConfigs;