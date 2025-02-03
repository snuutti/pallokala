import { ConfigPlugin, withProjectBuildGradle, withAppBuildGradle } from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

export const withWidgetDependencies: ConfigPlugin = (config) => {
    config = withProjectBuildGradle(config, (newConfig) => {
        newConfig.modResults.contents = mergeContents({
            src: newConfig.modResults.contents,
            newSrc: "        classpath('org.jetbrains.kotlin:kotlin-serialization:1.6.3')",
            tag: "kotlin serialization",
            anchor: /classpath\('org.jetbrains.kotlin:kotlin-gradle-plugin'\)/,
            offset: 1,
            comment: "//"
        }).contents;

        return newConfig;
    });

    config = withAppBuildGradle(config, (newConfig) => {
        let newContents = mergeContents({
            src: newConfig.modResults.contents,
            newSrc: "apply plugin: 'org.jetbrains.kotlin.plugin.serialization'",
            tag: "kotlin serialization plugin",
            anchor: /apply plugin: "org.jetbrains.kotlin.android"/,
            offset: 1,
            comment: "//"
        }).contents;

        // TODO: Upgrade Ktor when RN 0.77 is usable
        newContents = mergeContents({
            src: newContents,
            newSrc: `
    implementation("io.ktor:ktor-client-core:2.3.12")
    implementation("io.ktor:ktor-client-okhttp:2.3.12")
    implementation("io.ktor:ktor-client-content-negotiation:2.3.12")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.12")
    implementation("com.github.bastiaanjansen:otp-java:2.1.0")`,
            tag: "widget dependencies",
            anchor: /dependencies {/,
            offset: 1,
            comment: "//"
        }).contents;

        newConfig.modResults.contents = newContents;
        return newConfig;
    });

    return config;
};