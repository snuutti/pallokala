import { useTranslation } from "react-i18next";
import { Tabs } from "expo-router";
import NavigationIcon from "@/components/navigation/NavigationIcon";

export default function AuthLayout() {
    const { t } = useTranslation();

    return (
        <Tabs>
            <Tabs.Screen
                name="email"
                options={{
                    title: t("users:Email"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="email" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="oauth"
                options={{
                    title: "OAuth",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="xml" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}