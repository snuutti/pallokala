import { Stack } from "expo-router";
import SaveButton from "@/components/server/files/SaveButton";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";

export default function RootNavigation() {
    const { accounts } = useAccount();
    const { openFile } = useServer();

    return (
        <Stack>
            <Stack.Screen
                name="(app)"
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="login"
                options={{
                    title: "Login",
                    headerShown: accounts.length > 0
                }}
            />

            <Stack.Screen
                name="(modal)/editfile"
                options={{
                    title: openFile?.name || "Edit File",
                    presentation: "modal",
                    animation: "fade_from_bottom",
                    headerRight: SaveButton
                }}
            />

            <Stack.Screen
                name="(modal)/edituser"
                options={{
                    title: "Edit User",
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/enroll2fa"
                options={{
                    title: "Two Factor Authentication",
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />
        </Stack>
    );
}