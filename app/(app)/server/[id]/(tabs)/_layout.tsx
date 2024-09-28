import { Tabs, useLocalSearchParams } from "expo-router";
import NavigationIcon from "@/components/navigation/NavigationIcon";

export default function TabsLayout() {
    const { id } = useLocalSearchParams<{ id: string }>();

    console.log({ id });

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