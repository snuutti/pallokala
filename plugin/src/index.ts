import { ConfigPlugin } from "@expo/config-plugins";
import { withColorFix } from "./android/withColorFix";
import { withMenuDrawables } from "./android/withMenuDrawables";

const withAppConfigs: ConfigPlugin = (config) => {
    config = withColorFix(config);
    config = withMenuDrawables(config);
    return config;
};

export default withAppConfigs;