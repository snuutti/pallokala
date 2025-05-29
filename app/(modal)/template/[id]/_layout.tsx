import { useEffect } from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import TemplateErrorScreen from "@/components/templates/TemplateErrorScreen";
import LoadingScreen from "@/components/screen/LoadingScreen";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";

export default function TemplateLayout() {
    const { t } = useTranslation();
    const { template, loadTemplate, error } = useTemplateEditor();
    const { id, repo } = useLocalSearchParams<{ id: string, repo: string }>();

    useEffect(() => {
        console.log(`Fetching template ${id} from ${repo}`);

        loadTemplate(id, parseInt(repo));
    }, [id, repo]);

    console.log(id, repo)

    if (error) {
        return <TemplateErrorScreen />;
    }

    if (!template || template.name !== id || template.repository !== parseInt(repo)) {
        return <LoadingScreen />;
    }

    return (
        <Tabs
            screenOptions={{
                animation: "shift"
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t("templates:General"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="information" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="variables"
                options={{
                    title: t("templates:Variables"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="variable" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="install"
                options={{
                    title: t("templates:Install"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="package-down" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="run"
                options={{
                    title: t("templates:RunConfig"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="play-circle" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="hooks"
                options={{
                    title: t("templates:Hooks"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="function-variant" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="environment"
                options={{
                    title: t("templates:Environment"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="cube-outline" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="json"
                options={{
                    title: t("templates:Json"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="code-json" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}