import { Tabs } from "expo-router";
import NavigationIcon from "@/components/navigation/NavigationIcon";

export default function SettingsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Panel Settings",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="cog" color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="email"
                options={{
                    title: "Email Settings",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <NavigationIcon name="email-edit" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}