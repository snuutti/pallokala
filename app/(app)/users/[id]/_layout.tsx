import { Tabs, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useApiClient } from "@/context/ApiClientProvider";

export default function UserViewLayout() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: t("users:Details"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="account" color={color} />
                    )
                }}
                initialParams={{ id }}
                redirect={!apiClient?.auth.hasScope("users.info.view")}
            />

            <Tabs.Screen
                name="permissions"
                options={{
                    title: t("users:Permissions"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="lock-open" color={color} />
                    )
                }}
                initialParams={{ id }}
                redirect={!apiClient?.auth.hasScope("users.perms.view")}
            />
        </Tabs>
    );
}