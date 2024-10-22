import { Tabs } from "expo-router";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useApiClient } from "@/context/ApiClientProvider";

export default function SelfLayout() {
    const { apiClient } = useApiClient();

    return (
        <Tabs>
            <Tabs.Screen
                name="account"
                options={{
                    title: "Change Account Details",
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
                    title: "Change Password",
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
                    title: "Two factor authentication",
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
                    title: "OAuth2 Clients",
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