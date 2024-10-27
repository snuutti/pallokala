import { useEffect } from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import LoadingScreen from "@/components/screen/LoadingScreen";
import { useServer } from "@/context/ServerProvider";

export default function TabsLayout() {
    const { server, switchServer } = useServer();
    const { id } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        switchServer(id);
    }, [id]);

    if (!server || server.id !== id) {
        return <LoadingScreen />;
    }

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Console",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="console-line" color={color} />
                    )
                }}
                redirect={!server.hasScope("server.console") && !server.hasScope("server.console.send")}
            />

            <Tabs.Screen
                name="statistics"
                options={{
                    title: "Statistics",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="chart-line" color={color} />
                    )
                }}
                redirect={!server.hasScope("server.stats")}
            />

            <Tabs.Screen
                name="files"
                options={{
                    title: "Files",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="file" color={color} />
                    )
                }}
                redirect={!server.hasScope("server.files.view")}
            />

            <Tabs.Screen
                name="users"
                options={{
                    title: "Users",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="account-multiple" color={color} />
                    )
                }}
                redirect={!server.hasScope("server.users.view")}
            />

            <Tabs.Screen
                name="sftp"
                options={{
                    title: "SFTP Information",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="nas" color={color} />
                    )
                }}
                redirect={!server.hasScope("server.sftp")}
            />

            <Tabs.Screen
                name="admin"
                options={{
                    title: "Admin",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="account-star" color={color} />
                    )
                }}
                redirect={!server.hasScope("server.definition.view") && !server.hasScope("server.delete")}
            />
        </Tabs>
    );
}