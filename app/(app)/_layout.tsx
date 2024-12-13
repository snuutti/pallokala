import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import LoginErrorScreen from "@/components/auth/LoginErrorScreen";
import LoadingScreen from "@/components/screen/LoadingScreen";
import OtpRequiredScreen from "@/components/auth/OtpRequiredScreen";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import DrawerHeaderButton from "@/components/navigation/DrawerHeaderButton";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
import { useColors } from "@/hooks/useStyle";

export default function AppLayout() {
    const colors = useColors();
    const { t } = useTranslation();
    const { apiClient, config } = useApiClient();
    const { otpRequired, loading, error } = useAccount();
    const { server } = useServer();

    if (error) {
        return <LoginErrorScreen />;
    }

    if (apiClient === undefined || !config || loading) {
        return <LoadingScreen />;
    }

    if (otpRequired) {
        return <OtpRequiredScreen />;
    }

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTintColor: colors.text,
                headerRight: () => <DrawerHeaderButton />,
                drawerActiveBackgroundColor: colors.primaryHover
            }}
            backBehavior="history"
        >
            <Drawer.Screen
                name="index"
                options={{
                    drawerLabel: t("servers:Servers"),
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="server" color={color} />
                    ),
                    title: t("servers:Servers")
                }}
            />

            <Drawer.Screen
                name="nodes/index"
                options={{
                    drawerLabel: t("nodes:Nodes"),
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="server-network" color={color} />
                    ),
                    drawerItemStyle: {
                        display: apiClient.auth.hasScope("nodes.view") ? undefined : "none"
                    },
                    title: t("nodes:Nodes")
                }}
            />

            <Drawer.Screen
                name="users/index"
                options={{
                    drawerLabel: t("users:Users"),
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="account-multiple" color={color} />
                    ),
                    drawerItemStyle: {
                        display: apiClient.auth.hasScope("users.info.view") ? undefined : "none"
                    },
                    title: t("users:Users")
                }}
            />

            <Drawer.Screen
                name="templates/index"
                options={{
                    drawerLabel: t("templates:Templates"),
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="file-code" color={color} />
                    ),
                    drawerItemStyle: {
                        display: apiClient.auth.hasScope("templates.view") ? undefined : "none"
                    },
                    title: t("templates:Templates")
                }}
            />

            <Drawer.Screen
                name="settings"
                options={{
                    drawerLabel: t("settings:Settings"),
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="cog" color={color} />
                    ),
                    drawerItemStyle: {
                        display: apiClient.auth.hasScope("settings.edit") ? undefined : "none"
                    },
                    title: t("settings:Settings")
                }}
            />

            {/* We have to manually tell the Expo router which screens not to show. */}
            {/* According to them this is working as expected. I disagree. */}
            <Drawer.Screen
                name="self"
                options={{
                    drawerItemStyle: {
                        display: "none"
                    },
                    title: "Profile"
                }}
            />

            <Drawer.Screen
                name="server/[id]"
                options={{
                    drawerItemStyle: {
                        display: "none"
                    },
                    title: server?.name || t("servers:Servers")
                }}
            />

            <Drawer.Screen
                name="nodes/[id]"
                options={{
                    drawerItemStyle: {
                        display: "none"
                    },
                    title: "Node"
                }}
            />

            <Drawer.Screen
                name="nodes/new"
                options={{
                    drawerItemStyle: {
                        display: "none"
                    },
                    title: t("nodes:Create")
                }}
            />

            <Drawer.Screen
                name="users/[id]"
                options={{
                    drawerItemStyle: {
                        display: "none"
                    },
                    title: "User",
                    unmountOnBlur: true
                }}
            />

            <Drawer.Screen
                name="users/new"
                options={{
                    drawerItemStyle: {
                        display: "none"
                    },
                    title: t("users:Create")
                }}
            />
        </Drawer>
    );
}