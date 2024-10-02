import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Drawer } from "expo-router/drawer";
import LoadingScreen from "@/components/LoadingScreen";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import NavigationIcon from "@/components/navigation/NavigationIcon";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { getColors } from "@/constants/Colors";

export default function AppLayout() {
    const colorScheme = useColorScheme();
    const { apiClient, config } = useApiClient();
    const { loading } = useAccount();

    const colors = getColors(colorScheme);
    const styles = styling();

    if (apiClient === undefined || !config || loading) {
        return <LoadingScreen />;
    }

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTintColor: colors.text,
                headerRight: () => (
                    <TouchableOpacity style={styles.searchIcon}>
                        <NavigationIcon name="magnify" color={colors.text} />
                    </TouchableOpacity>
                ),
                drawerActiveBackgroundColor: colors.primaryHover,
            }}
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

            {/* We have to manually tell the Expo router which screens not to show. */}
            {/* According to them this is working as expected. I disagree. */}
            <Drawer.Screen
                name="server/[id]/(tabs)"
                options={{
                    drawerItemStyle: {
                        display: "none"
                    },
                    title: "server name" // TODO: set this dynamically
                }}
            />
        </Drawer>
    );
}

function styling() {
    return StyleSheet.create({
        searchIcon: {
            marginHorizontal: 11
        }
    });
}