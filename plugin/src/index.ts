import { ConfigPlugin } from "@expo/config-plugins";
import { withColorFix } from "./android/withColorFix";

const withAppConfigs: ConfigPlugin = (config) => {
    config = withColorFix(config);
    return config;
};

export default withAppConfigs;