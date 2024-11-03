import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useApiClient } from "@/context/ApiClientProvider";

export default function SelfLayout() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();

    return (
        <Tabs>
            <Tabs.Screen
                name="account"
                options={{
                    title: t("users:ChangeInfo"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="account" color={color} />
                    )
                }}
                redirect={!apiClient?.auth.hasScope("self.edit")}
            />

            <Tabs.Screen
                name="password"
                options={{
                    title: t("users:ChangePassword"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="lock" color={color} />
                    )
                }}
                redirect={!apiClient?.auth.hasScope("self.edit")}
            />

            <Tabs.Screen
                name="2fa"
                options={{
                    title: t("users:Otp"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="two-factor-authentication" color={color} />
                    )
                }}
                redirect={!apiClient?.auth.hasScope("self.edit")}
            />

            <Tabs.Screen
                name="oauth"
                options={{
                    title: t("oauth:Clients"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="xml" color={color} />
                    )
                }}
                redirect={!apiClient?.auth.hasScope("self.clients")}
            />
        </Tabs>
    );
}