import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import NavigationIcon from "@/components/navigation/NavigationIcon";

export default function SettingsLayout() {
    const { t } = useTranslation();

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: t("settings:PanelSettings"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="cog" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="email"
                options={{
                    title: t("settings:EmailSettings"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="email-edit" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}