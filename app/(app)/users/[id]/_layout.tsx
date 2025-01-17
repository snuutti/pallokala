import { useEffect } from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useApiClient } from "@/context/ApiClientProvider";
import { useBoundStore } from "@/stores/useBoundStore";

export default function UserViewLayout() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const setCurrentUser = useBoundStore(state => state.setCurrentUser);
    const { id } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        // For whatever reason useLocalSearchParams doesn't update on screens that aren't the index
        // so we have to manually keep track of the current user id
        setCurrentUser(Number(id));
    }, [id]);

    return (
        <Tabs
            screenOptions={{
                animation: "shift"
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t("users:Details"),
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="account" color={color} />
                    )
                }}
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
                redirect={!apiClient?.auth.hasScope("users.perms.view")}
            />
        </Tabs>
    );
}