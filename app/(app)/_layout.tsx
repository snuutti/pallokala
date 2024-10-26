import { Drawer } from "expo-router/drawer";
import LoginErrorScreen from "@/components/screen/LoginErrorScreen";
import LoadingScreen from "@/components/screen/LoadingScreen";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import DrawerHeaderButton from "@/components/navigation/DrawerHeaderButton";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";
import { useColors } from "@/hooks/useStyle";

export default function AppLayout() {
    const colors = useColors();
    const { apiClient, config } = useApiClient();
    const { loading, error } = useAccount();
    const { server } = useServer();

    if (error) {
        return <LoginErrorScreen />;
    }

    if (apiClient === undefined || !config || loading) {
        return <LoadingScreen />;
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
                    drawerLabel: "Servers",
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="server" color={color} />
                    ),
                    title: "Servers"
                }}
            />

            <Drawer.Screen
                name="nodes/index"
                options={{
                    drawerLabel: "Nodes",
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="server-network" color={color} />
                    ),
                    drawerItemStyle: {
                        display: apiClient.auth.hasScope("nodes.view") ? undefined : "none"
                    },
                    title: "Nodes"
                }}
            />

            <Drawer.Screen
                name="users/index"
                options={{
                    drawerLabel: "Users",
                    drawerIcon: ({ color }) => (
                        <NavigationIcon name="account-multiple" color={color} />
                    ),
                    drawerItemStyle: {
                        display: apiClient.auth.hasScope("users.info.view") ? undefined : "none"
                    },
                    title: "Users"
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
                    title: server?.name || "Servers"
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
                    title: "Create Node"
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
                    title: "Create User"
                }}
            />
        </Drawer>
    );
}