import { ExpoConfig, ConfigContext } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const packageIdentifier = IS_DEV ? "io.github.snuutti.pallokala.dev" : "io.github.snuutti.pallokala";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Pallokala" + (IS_DEV ? " (Development)" : ""),
    slug: "pallokala",
    version: "1.5.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pallokala",
    userInterfaceStyle: "automatic",
    ios: {
        bundleIdentifier: packageIdentifier,
        config: {
            usesNonExemptEncryption: false
        },
        supportsTablet: true
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        package: packageIdentifier,
        versionCode: 7
    },
    plugins: [
        [
            "expo-router",
            {
                sitemap: false
            }
        ],
        "expo-font",
        "expo-secure-store",
        "expo-localization",
        [
            "expo-build-properties",
            {
                android: {
                    usesCleartextTraffic: true
                }
            }
        ],
        [
            "expo-dev-client",
            {
                addGeneratedScheme: IS_DEV
            }
        ],
        [
            "expo-splash-screen",
            {
                backgroundColor: "#000000",
                mdpi: "./assets/images/splash/mdpi.png",
                hdpi: "./assets/images/splash/hdpi.png",
                xhdpi: "./assets/images/splash/xhdpi.png",
                xxhdpi: "./assets/images/splash/xxhdpi.png",
                xxxhdpi: "./assets/images/splash/xxxhdpi.png",
                imageWidth: 288
            }
        ],
        "expo-quick-actions",
        "expo-web-browser",
        "react-native-edge-to-edge",
        "./app.plugin.js"
    ],
    experiments: {
        typedRoutes: true
    },
    extra: {
        router: {
            origin: false
        },
        eas: {
            projectId: "da3ccb37-ee6e-4242-9afd-9d405dcad82e"
        }
    }
});