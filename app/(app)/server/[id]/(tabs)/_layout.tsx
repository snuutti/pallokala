import { useEffect } from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import LoadingScreen from "@/components/LoadingScreen";
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
            />
        </Tabs>
    );
}