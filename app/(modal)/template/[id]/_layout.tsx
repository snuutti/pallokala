import { useEffect } from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useNavigation, usePreventRemove } from "@react-navigation/core";
import { useTranslation } from "react-i18next";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import TemplateErrorScreen from "@/components/templates/TemplateErrorScreen";
import LoadingScreen from "@/components/screen/LoadingScreen";
import { useModal } from "@/context/ModalProvider";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";

export default function TemplateLayout() {
    const { t } = useTranslation();
    const { createAlertModal } = useModal();
    const { template, templateModified, loadTemplate, error } = useTemplateEditor();
    const { id, repo } = useLocalSearchParams<{ id: string, repo: string }>();
    const navigation = useNavigation();

    useEffect(() => {
        console.log(`Fetching template ${id} from ${repo}`);

        loadTemplate(id, parseInt(repo));
    }, [id, repo]);

    usePreventRemove(templateModified, ({ data }) => {
        createAlertModal(
            t("common:ConfirmLeave"),
            undefined,
            [
                {
                    text: t("common:Discard"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: () => {
                        navigation.dispatch(data.action);
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    });

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